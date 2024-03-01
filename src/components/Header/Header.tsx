// import { chainData } from "../../hooks/data";
// import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Box, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import ExchangeModal from "./ExchangeModal";
import { useDispatch, useSelector } from 'react-redux'
import {
  Link,
  /* Navigate, NavLink, */ useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  /* changeNetwork, */ getTransaction /* , sendToken */,
} from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import { /* buyPremium,  */ getResources } from '../../store/user/actions'
// import { ADMIN_WALLET_ADDRESS, chainId, PREMIUM_COST } from "../../hook/constants";
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { /* formatDecimal,  */ shortAddress } from '../../utils/tools'
import AccountIcon from '../AccountIcon/AccountIcon'
import PreniumModal from '../Modal/PremiumModal'

import styles from './Header.module.scss'
import HeaderModal from './HeaderModal'
import { ClientRequest } from 'http'
import InforModal from './InforModal'

interface HeaderProps {
  showAccount: any
  setShowAccount: any
  csc: any
  realCSC: any
  eggs: any
  resource: any
}

const Header = ({ showAccount, setShowAccount, csc, realCSC, eggs, resource }: HeaderProps) => {
  const navigate = useNavigate()
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
        <img alt="" className='w-[25px] mx-[3px]' src="/images/cryptoIcon.png" />
        TEST CSC: {csc}
      </p>
      <p className={styles.resource}>
        <img alt="" className='w-[25px] mx-[3px]' src="/images/cryptoIcon.png" />
        REAL CSC: {realCSC}
      </p>
      <p className={styles.resource}>
        <img alt="" className='w-[25px] mx-[3px]' src="/images/res_res.png" />
        Water: {resource}
      </p>
      <p className={styles.resource}>
        <img alt="" className='w-[20px] mx-[3px]' src="/images/res_egg.png" />
        Res: {eggs}
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
        <PreniumModal open={openPremium} setOpen={setOpenPremium} />

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
