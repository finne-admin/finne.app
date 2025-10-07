export const PA_BASE_SECONDS = 36
export const PA_BASE_AMOUNT = 10

export function getVideoExp(durationSec: number) {
  return Math.max(1, Math.round((durationSec / PA_BASE_SECONDS) * PA_BASE_AMOUNT))
}
