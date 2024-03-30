import AlarmIcon from '@mui/icons-material/Alarm'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { Grid /* , TextField, Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { /* React,  */ useState /* , useEffect */ } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  chainId,
  PREMIUM_COST,
  URANIUM_MINE,
} from '../../hooks/constants'
import { /* deposit,  */ sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  /* buyMining,  */ buyPremium /* , claimMining, requestMining */,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'

interface Props {
  open: boolean
  setOpen: any
}

const PreniumModal = ({ open, setOpen }: Props) => {
  const { /* connected, chainID, */ address /* , connect */ } = useWeb3Context()
  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)
  const { user } = userModule

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  // const [showBuyButton, setBuyButton] = useState(true);
  // const [requested, setRequested] = useState(false);
  // const [uTime, setuTime] = useState(0);

  const onBuyPremium = async () => {
    handleClose()
    try {
      dispatch(onShowAlert('Pease wait while confirming', 'info'))

      const transaction = await sendToken(
        address,
        ADMIN_WALLET_ADDRESS[chainId],
        PREMIUM_COST,
      )
      dispatch(
        buyPremium(
          address,
          PREMIUM_COST,
          transaction.transactionHash,
          (res: any) => {
            if (res.success) {
              dispatch(onShowAlert('Buy permium successfully', 'success'))
            } else {
              dispatch(onShowAlert('Faild in buying premium', 'warning'))
            }
          },
        ),
      )
    } catch (e) {
      // console.log(e);
    }
  }

  const style = {
    background: "url(/assets/images/set.png)",
    backgroundSize: '100% 100%',
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[450px] h-[650px] bg-transparent p-4 pt-1">
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[12%] translate-x-[26%] translate-y-[-27%] cursor-pointer z-10'
            onClick={handleClose}
          />
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div
                className='well-back w-[350px] h-[300px] m-[auto] mt-[50px]'
                style={{
                  background: "url(images/premium.png)",
                  backgroundSize: 'cover',
                }}
              ></div>
              <Box className='flex flex-col items-center gap-[20px]'>
                <h2 className="font-bold text-[20px] mb-0 mt-4 text-white upgrade-label text-center" style={{ fontFamily: 'Anime Ace' }}>
                  TIME: 30 DAYS<br></br>
                  WATER CLAIM: +30%<br></br>
                  WALL HP: +20%<br></br>
                </h2>
                <Button
                  className='text-white border-none w-[200px] h-11'
                  style={{
                    background: "url(/assets/images/big-button.png)",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    fontFamily: 'Anime Ace',
                  }}
                  onClick={(e) => onBuyPremium()}
                >
                  buy
                </Button>
                <h2 className="font-bold text-[20px] mb-0 mt-4 text-white upgrade-label text-center" style={{ fontFamily: 'Anime Ace' }}>
                  PRICE: 9.9<span className='text-[#28d433]'> USDT</span><br></br>
                </h2>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default PreniumModal
