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
// import { showMinutes } from "../../utils/timer";
import { onShowAlert } from '../../store/utiles/actions'
// import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

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
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '650px',
    background: "url(/assets/images/set.png)",
    backgroundSize: '100% 100%',
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
    pt: 1,
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[450px]">
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8%',
              transform: 'translate(26%, -27%)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={handleClose}
          />
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div
                className='well-back'
                style={{
                  width: '350px',
                  height: '300px',
                  background: "url(images/premium.png)",
                  backgroundSize: 'cover',
                  margin: 'auto',
                  marginTop: '50px',
                }}
              ></div>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <h2 className="font-bold text-2xl mb-4 text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px',
                    textAlign: 'center',
                  }}
                >
                  TIME: 30 DAYS<br></br>
                  WATER CLAIM: +30%<br></br>                  
                  WALL HP: +20%<br></br>
                </h2>
                <Button
                  style={{
                    background: "url(/assets/images/big-button.png)",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    fontFamily: 'Anime Ace',
                    color: 'white',
                    border: 'none',
                    width: '200px',
                    height: '42px'
                  }}
                  onClick={(e) => onBuyPremium()}
                >
                  buy
                  {/* {counting === 0 ? 'START' : timer === 0 ? 'CLAIM' : `${showHourMinutes(timer)}`} */}
                </Button>
                <h2 className="font-bold text-2xl mb-4 text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px',
                    textAlign: 'center',
                  }}
                >
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
