import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Rotas de transação', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  test('criar uma nova transação', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)
  })

  test('listar todas as transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'Nova transação', amount: 1000 }),
    ])
  })

  test('buscar uma transação específica', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'Nova transação', amount: 1000 }),
    ])

    const transactionId = listTransactionResponse.body.transactions[0].id

    const transactionResponse = await request(app.server)
      .get('/transactions/' + transactionId)
      .set('Cookie', cookies)
      .expect(200)

    expect(transactionResponse.body.transaction).toEqual(
      expect.objectContaining({ title: 'Nova transação', amount: 1000 }),
    )
  })

  test('buscar o resumo de transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação de crédito',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Transação de debíto',
        amount: 500,
        type: 'debit',
      })
      .expect(201)

    const transactionResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(transactionResponse.body.summary).toEqual(
      expect.objectContaining({ amount: 500 }),
    )
  })
})
