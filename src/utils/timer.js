export function showMinutes(seconds) {
  const min = Math.ceil(seconds / 60)

  return 'Min:' + min
}

export function showHours(seconds) {
  const hr = Math.ceil(seconds / 3600)

  return hr + ' Hours'
}

export function showHourMinutes(seconds) {
  const min = Math.ceil(seconds / 60)
  const s = Math.ceil(seconds % 60)
  const h = Math.floor(min / 60)
  const m = Math.floor(min % 60)
  return h + ':' + m + ':' + s;

  // return 0 + ':' + seconds
}

export function showYMD(date) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();

  return month + '.' + day + '.' + year;
}

export function convertSecToHMS(number) {
  const hours = Math.floor(number / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((number % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (number % 60).toString().padStart(2, '0')
  const formattedTime = `${hours}:${minutes}:${seconds}` /*${hours}:*/
  return formattedTime
}

export function convertSecToDHMS(number, from) {
  const days = Math.floor(number / 86400)
    .toString()
    .padStart(2, '0')
  const tmp1 = number % 86400;
  const hours = Math.floor(tmp1 / 3600)
    .toString()
    .padStart(2, '0')
  const tmp2 = tmp1 % 3600;
  const minutes = Math.floor(tmp2 / 60)
    .toString()
    .padStart(2, '0')
  const tmp3 = tmp2 % 60;
  const seconds = (tmp3 % 60).toString().padStart(2, '0')
  const formattedTime = `${(from === "barb" && days >= 7) ? days - 7 : days}days ${hours}:${minutes}:${seconds}` /*${hours}:*/
  return formattedTime
}