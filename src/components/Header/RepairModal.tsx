import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { useWeb3Context } from '../../hooks/web3Context'
import { restoreWall } from '../../store/user/actions'

interface Props {
  repairModalOpen: any
  setRepairModalOpen: any
  csc: any
  setCSC: any
  currentWallHP: any
  setCurrentWallHP: any
  getBarbarians: any
}

const RepairModal = ({
  repairModalOpen,
  setRepairModalOpen,
  csc,
  setCSC,
  currentWallHP,
  setCurrentWallHP,
  getBarbarians
}: Props) => {
  const { address } = useWeb3Context()
  const restore = () => {
    if (address !== "") {
      if (currentWallHP > 0) {
        alert("You don't need restore!")
        return;
      }
      if (csc < 60) {
        alert("Not enough csc token!")
        return;
      }
      restoreWall(address).then((res: any) => {
        if (res.data === false) {
          alert(res.message);
          return;
        }
        setCSC(res.cscTokenAmount)
        setCurrentWallHP(res.wallHP)
        alert("Your wall successfully restored!!!")
        setRepairModalOpen(false);
        getBarbarians();
      })
    }
  }
  return (
    <>
      <Modal
        open={repairModalOpen}
        onClose={() => setRepairModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[700px]'>
          <img alt="" draggable="false" src="/images/support/support_md_bg.png" />

          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setRepairModalOpen(false)}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full z-10'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2`}>REPAIR</p>
          </div>
          <div className='flex-mid flex-col gap-y-8 absolute w-[40.6rem] h-[26.6rem] top-[1.6rem] left-[1.7rem] rounded-xl'>
            <img alt="" draggable="false" src="assets/images/broken_wall.webp" className='w-full h-full rounded-xl' />
          </div>
          <div className='flex-mid flex-col gap-y-8 absolute w-[40.6rem] h-[26.6rem] top-[1.6rem] left-[1.7rem] rounded-xl' style={{ boxShadow: "inset 0 0px 20px 0 #000000ab" }}>
            <div className='text-center text-white font-bold' style={{ textShadow: "0 3px 7px black" }}>YOUR LAND WAS DESTROYED BY BARBARIANS<br /> RESTORE WILL COST<span className='text-[#f08120]'> 60 CSC</span></div>
            <Button className='text-white border-none w-48 h-10'
              style={{
                background: "url(/assets/images/big-button.png)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                fontFamily: 'Anime Ace'
              }}
              onClick={restore}
            >
              <p className='text-white font-bold'>
                RESTORE
              </p>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default RepairModal
