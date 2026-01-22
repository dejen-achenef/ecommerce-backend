import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import router from '../src/routes/index.js'

const app = express()
app.use('/api', router)
app.get('/health', (req, res) => res.json({ status: 'ok' }))

describe('health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
