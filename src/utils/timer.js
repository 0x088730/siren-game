export function showMinutes(seconds) {
  const min = Math.ceil(seconds / 60)

  return 'Min:' + min
}

export function showHours(seconds) {
  const hr = Math.ceil(seconds / 3600)

  return hr + ' Hours'
}

export function showHourMinutes(seconds) {
  // const min = Math.ceil(seconds / 60)
  // const h = Math.floor(min / 60)
  // const m = Math.floor(min % 60)
  // return h + ':' + m
 
  return 0 + ':' + seconds
}