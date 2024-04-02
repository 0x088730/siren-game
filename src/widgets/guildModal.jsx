import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { global } from '../common/global'
import { useEffect, useState } from 'react'
import store from '../store'
import { setButtonView } from '../common/state/game/reducer'
import MinePart from '../components/guilds/mine'
import CreatePart from '../components/guilds/create'
import ListPart from '../components/guilds/list'
import { getGuild } from '../store/user/actions'

const GuildModal = ({ openGuild, setOpenGuild }) => {
    const [nav, setNav] = useState("list");
    const [searchName, setSearchName] = useState("");
    const [guildList, setGuildList] = useState([]);
    const [presentList, setPresentList] = useState([]);
    const [userStatus, setUserStatus] = useState(false);
    const [userGuild, setUserGuild] = useState({})

    useEffect(() => {
        setPresentList(guildList);
    }, [nav])
    useEffect(() => {
        if (global.walletAddress !== '') {
            getGuild(global.walletAddress).then(res => {
                if (res.data === false) {
                    alert(res.message);
                    return;
                }
                setGuildList(res.data.guildList);
                setPresentList(res.data.guildList);
                setUserGuild(res.data.userGuild);
                setUserStatus(res.data.userStatus)
            })
        }
    }, [openGuild])

    useEffect(() => {
        if (searchName !== "") {
            setPresentList([]);
            let currentArray = [];
            for (let i = 0; i < guildList.length; i++) {
                if (guildList[i].title.includes(searchName)) {
                    currentArray.push(guildList[i]);
                }
            }
            setPresentList(currentArray);
        } else {
            setPresentList(guildList);
        }
    }, [searchName])

    return (
        <>
            <Modal
                open={openGuild}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-[55%] left-1/2 translate-x-[-50%] translate-y-[-50%] text-center w-[900px] h-[600px] p-2 pt-1" style={{ backgroundImage: "url(assets/images/frame.webp)", backgroundSize: '100% 100%' }}>
                    <div className='absolute top-[-18%]'>
                        <div className='flex-mid relative w-[866px] h-[95px]'>
                            <img alt="" draggable="false" src="/assets/images/guild_title.webp" className='w-full h-full' />
                            <div className='flex-mid absolute right-20 items-start text-white'>
                                <div>EVENT:</div>
                                <div>TOP 3 CSC EARN GUILD OWNERS WILL RECEIVE 200$(CSC)<br />TOP 1: 1000$ TOP 2: 600$ TOP 3: 400$ | <span className='text-[#df9d25]'>APRIL 16</span></div>
                            </div>
                        </div>
                    </div>
                    <img
                        alt=""
                        src="/images/support/support_md_close_btn.png"
                        className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-10'
                        onClick={() => {
                            setOpenGuild(false);
                            store.dispatch(setButtonView(true));
                        }}
                    />
                    <div className='absolute w-[52.5rem] h-[33.75rem] bg-[#323239]/[0.6] top-[1.9rem] left-[1.8rem] rounded-xl backdrop-blur-xl' style={{ boxShadow: "inset 0 0px 10px 0 #000000ab" }}>
                        <div className='flex justify-between items-center h-16 border-b-2 border-[#FAFAFA]/[0.2] px-8'>
                            <div className='flex justify-center items-center text-white text-[16px] h-full'>
                                <div className={`flex-mid p-4 cursor-pointer h-full ${nav === "list" ? "nav-bg border-b-1 border-[#9BA9B9]" : "text-[#ffffff]/[0.6]"}`} onClick={() => setNav("list")}>LIST OF GUILDS</div>
                                <div className={`flex-mid p-4 cursor-pointer h-full ${nav === "mine" ? "nav-bg border-b-1 border-[#9BA9B9]" : "text-[#ffffff]/[0.6]"}`} onClick={() => setNav("mine")}>MY GUILD</div>
                                <div className={`flex-mid p-4 cursor-pointer h-full ${nav === "create" ? "nav-bg border-b-1 border-[#9BA9B9]" : "text-[#ffffff]/[0.6]"}`} onClick={() => setNav("create")}>CREATE</div>
                            </div>
                            <div className='relative flex-mid'>
                                <img alt="" draggable="false" src="/assets/images/search.png" className='absolute left-4' />
                                <input
                                    className='h-[40px] w-[260px] rounded-lg border-[1px] border-[#FAFAFA]/[0.2] bg-[#D9E1FF]/[0.1] text-[#9F98A2] text-[14px] pl-10'
                                    name="name"
                                    placeholder='ENTER GUILD NAME...'
                                    onChange={(e) => { setNav("list"); setSearchName(e.target.value); }}
                                />
                            </div>
                        </div>
                        <div className={`w-full ${nav === "mine" ? "px-0 my-0 h-[29.75rem]" : "px-8 my-6 h-[26.75rem]"} overflow-y-auto`}>
                            {nav === "list" ?
                                <ListPart
                                    userStatus={userStatus}
                                    setUserStatus={setUserStatus}
                                    guildList={guildList}
                                    setGuildList={setGuildList}
                                    presentList={presentList}
                                    setPresentList={setPresentList}
                                    userGuild={userGuild}
                                    setUserGuild={setUserGuild}
                                />
                                :
                                nav === "mine" ?
                                    <MinePart
                                        nav={nav} setNav={setNav}
                                        guildList={guildList} setGuildList={setGuildList}
                                        userGuild={userGuild} setUserGuild={setUserGuild}
                                        userStatus={userStatus} setUserStatus={setUserStatus}
                                    />
                                    :
                                    <CreatePart
                                        userStatus={userStatus}
                                        setUserStatus={setUserStatus}
                                        guildList={guildList}
                                        setGuildList={setGuildList}
                                        userGuild={userGuild}
                                        setUserGuild={setUserGuild}
                                    />
                            }
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default GuildModal
