import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams, } from 'react-router-dom'
import { useWeb3Context } from '../../hooks/web3Context'
import { getResources } from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { shortAddress } from '../../utils/tools'
import PreniumModal from '../Modal/PremiumModal'
import styles from './Header.module.scss'
import InforModal from './InforModal'

interface HeaderProps {
  showAccount: any
  setShowAccount: any
  csc: any
  water: any
  resource: any
  premiumStatus: any
  setPremiumStatus: any
}

const Header = ({ showAccount, setShowAccount, csc, water, resource, premiumStatus, setPremiumStatus }: HeaderProps) => {
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref')

  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)

  const [openAccount, setOpenAccount] = useState(showAccount)
  const [openPremium, setOpenPremium] = useState(false)

  const [ispremium, setIsPremium] = useState(false)
  const [leftDay, setLeftDay] = useState(0)
  const [show, setShow] = useState(false)

  const { connected, chainID, address, connect } = useWeb3Context()

  const handleOpenAccount = (flag: boolean) => {
    setOpenAccount(flag)
    setShowAccount(false)
  }

  const setOpenedAccount = () => {
    setOpenAccount(true)
  }
  useEffect(() => {
    if (connected && address !== '') {
      setShow(true)
      dispatch(
        getResources(address, ref, (res: any) => {
          if (!res.success) {
            dispatch(onShowAlert(res.message, 'info'))
          }
        }),
      )
    } else {
    }
  }, [chainID, connected, address])

  useEffect(() => {
    const res = checkPremium(userModule.user.premium)
    setIsPremium(res.isPremium)
    setLeftDay(res.leftDay)
  }, [userModule.user.premium])

  const getPremium = async () => {
    setOpenPremium(true)
    // try{
    //   dispatch(onShowAlert("Pease wait while confirming", "info"));
    //   let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], PREMIUM_COST);
    //   dispatch(buyPremium(address, PREMIUM_COST, transaction.transactionHash, (res:any)=>{
    //     if(res.success) {
    //       dispatch(onShowAlert("Buy permium successfully", "success"));
    //     } else {
    //       dispatch(onShowAlert("Faild in buying premium", "warning"));
    //     }
    //   }));
    // } catch(e){
    //   console.log(e);
    // }
  }

  useEffect(() => {
    headerList()
  }, [userModule])

  const headerList = () => {
    return <Box
      className={styles.Siren}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      {!ispremium && (
        <button
          onClick={getPremium}
          className='bg-cover bg-no-repeat w-[170px] h-10 me-[10px] text-[14px] font-bold tracking-[2px]'
          style={{ backgroundImage: 'url(/images/premium_btn.png)' }}
        >
          {/* Premium */}
        </button>
      )}
      {ispremium && (
        <p className='whitespace-nowrap me-[8px] font-[700] text-[18px]'>{`${leftDay} Days`}</p>
      )}

      {show && (
        <button
          onClick={setOpenedAccount}
          className={`${styles.resource} text-center`}
        >
          <span className='flex justify-center items-center text-[14px] font-bold w-full'>
            <span>{shortAddress(address)}</span>
            {/* <AccountIcon address={address} size={18} /> */}
          </span>
        </button>
      )}
      <p className={styles.resource}>
        <img alt="" draggable="false" className='w-[25px] mx-[3px]' src="/images/cryptoIcon.png" />
        CSC: {csc}
      </p>
      <p className={styles.resource}>
        <img alt="" draggable="false" className='w-[25px] mx-[3px]' src="/images/res_res.png" />
        Water: {water}
      </p>
      <p className={styles.resource}>
        <img alt="" draggable="false" className='w-[20px] mx-[3px]' src="/images/res_egg.png" />
        Res: {resource}
      </p>
    </Box>
  }

  return (
    <header>
      <Box className={styles.contents}
        sx={{
          zIndex: 100
        }}>
        <InforModal
          openAccount={openAccount}
          setOpenAccount={handleOpenAccount}
        />
        <PreniumModal open={openPremium} setOpen={setOpenPremium} premiumStatus={premiumStatus} setPremiumStatus={setPremiumStatus} />

        {headerList()}

        <Box
          className={styles.Siren}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Link to="/" className="button muted-button">
            <button className='w-[115px] h-10 bg-no-repeat'
              style={{ backgroundImage: 'url(/images/back_btn.png)', backgroundSize: "100% 100%" }}
            >
            </button>
          </Link>
        </Box>
      </Box>
    </header>
  )
}

export default Header
