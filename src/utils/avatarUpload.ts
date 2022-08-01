export const imagePercent = 0.6875
export const resolutionMultiplier = 4
export const maxSpeed = 96

export const getVars = (canvas: HTMLCanvasElement) => {
  if (!canvas) {
    return {
      ip: 0,
      sz: 0,
      crpSz: 0,
      invSz: 0,
      ctx: null,
      max: 0,
    }
  }

  const ctx = canvas.getContext('2d')!

  const ip = imagePercent
  const sz = canvas.width
  const crpSz = sz * ip
  const invSz = sz * (1 - ip)
  return {
    ip,
    sz,
    crpSz,
    invSz,
    ctx,
    max: invSz / 2,
  }
}

export const distanceFromEdge = (
  n: number,
  max: number,
  s: number,
  crpSz: number,
) => (n > max ? max - n : Math.max(max - (n + s) + crpSz, 0))

export const calcMomentum = (
  n: number,
  max: number,
  s: number,
  crpSz: number,
) => {
  let momentum = 0
  const sn = distanceFromEdge(n, max, s, crpSz)
  if (sn > 0 || sn < 0) {
    if (sn <= resolutionMultiplier * 2 && sn >= -resolutionMultiplier * 2) {
      momentum = sn
    } else {
      momentum = Math.round(Math.min(Math.max(sn / 16, -maxSpeed), maxSpeed))
    }
  }
  return momentum
}
