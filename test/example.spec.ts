import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Rotas de transação', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('o usuário consegue criar uma nova transação', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)
  })
})
