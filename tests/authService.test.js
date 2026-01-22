import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../src/services/authService.js'
import * as userRepo from '../src/repositories/userRepository.js'
import bcrypt from 'bcrypt'

vi.mock('../src/repositories/userRepository.js')

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('register creates a new user when email not taken', async () => {
    userRepo.userRepository.findByEmail.mockResolvedValue(null)
    userRepo.userRepository.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', role: 'USER' })
    const res = await authService.register({ email: 'a@b.com', password: 'Passw0rd!', name: 'A' })
    expect(res.email).toBe('a@b.com')
  })

  it('login fails for bad password', async () => {
    const hash = await bcrypt.hash('Correct1!', 10)
    userRepo.userRepository.findByEmail.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: hash, role: 'USER' })
    await expect(authService.login({ email: 'a@b.com', password: 'Wrong' })).rejects.toHaveProperty('status', 401)
  })
})
