import axios from 'axios'

import config from './config'

export default async function callAPI(endpoint, method = 'get', data) {
  const configS = {
    method,
    // url: `${config.server}:${config.port}${config.baseURL}/${endpoint}`,
    url: `${config.server}${config.baseURL}/${endpoint}`,
    headers: {},
    data,
  }
  const res = await axios(configS)
  return res.data
}
