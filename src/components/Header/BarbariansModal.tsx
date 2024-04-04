import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import styles from "./Header.module.scss"

interface Props {
  barbaModalOpen: any
  setBarbaModalOpen: any
  attackStatus: any
  setAttackStatus: any
}

const BarbariansModal = ({
  barbaModalOpen,
  setBarbaModalOpen,
  attackStatus,
  setAttackStatus,
}: Props) => {
  const skullLength = [1, 2, 3];
  return (
    <>
      <Modal
        open={barbaModalOpen}
        onClose={() => setBarbaModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[700px]'>
          <img alt="" draggable="false" src="/images/support/support_md_bg.png" />

          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setBarbaModalOpen(false)}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full z-10'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2 tracking-[-2px]`}>BARBARIANS</p>
          </div>
          <div className='flex-mid flex-col absolute w-[40.5rem] h-[26.5rem] top-[1.6rem] left-[1.7rem] rounded-xl'>
            <div>STATUS: <span className='text-[#2de964]'>{attackStatus ? "ATTACK" : "CALM"}</span></div>
            <div className='flex-mid'>
              <div className={`${styles.lvl1Box} flex-mid flex-col w-52 h-72`}>
                <div className='flex-mid gap-x-1'>
                  {skullLength.map((item) => (
                    <img key={item} alt="" draggable="false" src="/assets/images/skull.webp" className='w-12' />
                  ))}
                </div>
                <img alt="" draggable="false" className={``} src={`/assets/images/barbarian.webp`} />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default BarbariansModal
