import axios from 'axios'
import { tokenPrice } from '../hooks/hook';

// export const getPrice = (address: string) => {
//     const options = { method: 'GET', headers: { accept: 'application/json', 'x-api-key': 'demo' } };

//     fetch('https://api.chainbase.online/v1/token/price?chain_id=56&contract_address=0x6bbf980b64a2b467559bea94dd5bdf47dae67508', options)
//         .then(response => response.json())
//         .then(response => console.log(response))
//         .catch(err => console.error(err));
// }

export async function getPrice() {
    let token = 0;
    try {
        await tokenPrice().then(res => {
            token = res[1] / (res[0] * 1000000000)
        })
        await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin`, {})
            .then(response => {
                token = token * (response.data[0].current_price)
            })
    } catch (e) {
        throw (e);
        return false;
    }
    return token;
}