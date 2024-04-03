import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

interface Props {
  infoModalOpen: any
  setInfoModalOpen: any
}

const SupportInfoModal = ({
  infoModalOpen,
  setInfoModalOpen,
}: Props) => {

  return (
    <>
      <Modal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[550px]'>
          <img alt="" draggable="false" src="/images/support/support_md_bg.png" />
          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setInfoModalOpen(false)}
          />
          <div className='absolute w-[31.8rem] h-[20.8rem] bg-[#323239]/[0.6] top-[1.3rem] left-[1.3rem] rounded-lg' style={{ boxShadow: "inset 0 0px 10px 0 #000000ab" }}></div>
          <div className='absolute top-0 w-full h-full p-12 flex-mid flex-col gap-y-3 text-[#e7e1e1] text-[12px] leading-4'>
            <div>There are monsters in the area that can attack your fortress, so that they don’t destroy anything, you can put your heroes on the defense.</div>
            <div>If your fortress is destroyed, the current actions in it will be canceled and you will need to repair your buildings.</div>
            <div>If your land is attacked while the defense is active and you fight off the attack, you will receive <span className='text-[#f4db39]'>CSC tokens.</span></div>
            <div>{"The cost of each hour of protection = "}<span className='text-[#f4db39]'>2 resources.</span> You can cancel the protection at any time.</div>
            <div>The strength of monsters that can attack your land depends on the development of your land, for example if your land and buildings are well developed, and you sent only <span className='text-[#f4db39]'>1 hero</span> to defend, then the chance to repel the attack will be low.</div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default SupportInfoModal
