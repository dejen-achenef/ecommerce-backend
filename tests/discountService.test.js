import { describe, it, expect, vi } from 'vitest'
import { discountService } from '../src/services/discountService.js'
import * as repo from '../src/repositories/discountRepository.js'

vi.mock('../src/repositories/discountRepository.js')

describe('discountService', () => {
  it('returns zero when no code', async () => {
    const res = await discountService.validateAndCompute(undefined, 100)
    expect(res.discountAmount).toBe(0)
  })

  it('applies percent discount', async () => {
    repo.discountRepository.findByCode.mockResolvedValue({ id: 'd1', type: 'percent', amount: 10 })
    const res = await discountService.validateAndCompute('SAVE10', 200)
    expect(Math.round(res.discountAmount)).toBe(20)
  })

  it('applies fixed discount and caps at subtotal', async () => {
    repo.discountRepository.findByCode.mockResolvedValue({ id: 'd2', type: 'fixed', amount: 500 })
    const res = await discountService.validateAndCompute('GIANT', 100)
    expect(res.discountAmount).toBe(100)
  })
})
