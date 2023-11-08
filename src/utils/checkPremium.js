export const checkPremium = (premium) => {
  const date = new Date()

  const expiredTime = new Date(premium)
  // let curTime = new Date();
  expiredTime.setMonth(expiredTime.getMonth() + 1)

  //console.log(expiredTime, date)

  const curSec = date.getTime() + date.getTimezoneOffset() * 60 * 1000
  const endSec = expiredTime.getTime()

  if (endSec > curSec)
    return {
      isPremium: true,
      leftDay: Math.floor((endSec - curSec) / 1000 / 86400),
    }
  else return { isPremium: false, leftDay: 0 }
}
