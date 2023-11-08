import type { Withdraw } from '../store/user/action-types'

import api from './callApi'

const isWithin24h = (date: string): boolean => {
  return new Date(date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000
}

export const getBcsPrice = async (): Promise<number> => {
  return (await api(`user/get-bcs-price`, 'get')).price
}

export const getWithdrewSirenAmount = (withdraws: Withdraw[]): number => {
  //console.log('user withdraws ', withdraws)
  if (withdraws && withdraws.length > 0) {
    // const amounts = withdraws.map((item: Withdraw) => parseInt(item.amount))
    const amount = withdraws.reduce((prev: number, current: Withdraw) => {
      return prev + parseInt(current.amount, 10)
    }, 0)

    //console.log(`you withdraw ${amount} Siren for 24h`)
    return amount
  } else return 0
}
