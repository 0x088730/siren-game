import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import { global } from '../../common/global';
import { addMessage, leaveGuild } from '../../store/user/actions';
import { convertSecToHMS } from '../../utils/timer';

const MinePart = (props) => {
    const { guildList, setGuildList, nav, setNav, userGuild, setUserGuild, userStatus, setUserStatus } = props;

    const [chatPart, setChatPart] = useState(false);
    const [message, setMessage] = useState("")
    const [msgData, setMsgData] = useState([])
    const [remainTime, setRemainTime] = useState(0);
    const [isCooldownStarted, setIsCooldownStarted] = useState(false);

    useEffect(() => {
        if (global.walletAddress !== '' && nav === "mine") {
            setMsgData(userGuild.messages)
        }
    }, [nav])

    useEffect(() => {
        if (isCooldownStarted) {
            var cooldownInterval = setInterval(() => {
                setRemainTime((prevTime) => {
                    if (prevTime === 1) {
                        setIsCooldownStarted(false)
                    }
                    if (prevTime === 0) {
                        clearInterval(cooldownInterval)
                        setIsCooldownStarted(false)
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }
        return () => clearInterval(cooldownInterval)
    }, [isCooldownStarted])

    const onMessage = () => {
        if (message === "") {
            alert("Please input message...")
            return;
        }
        addMessage(global.walletAddress, message, userGuild).then(res => {
            if (res.data === false) {
                alert(res.message);
                return;
            }
            setRemainTime(10);
            setIsCooldownStarted(true)
            setGuildList(res.data.guildList);
            setUserGuild(res.data.userGuild)
            setMsgData(res.data.userGuild.messages)
            setMessage("")
        })
    }

    const onLeave = () => {
        leaveGuild(global.walletAddress, userGuild).then(res => {
            if (res.data === false) {
                alert(res.message);
                return;
            }
            setGuildList(res.data.guildList);
            setUserGuild(res.data.userGuild);
            setMsgData([]);
            setUserStatus(res.data.userStatus);
            setMessage("");
            setChatPart(false);
        })
    }

    const time = (createdAt) => {
        let time = Math.floor((Date.now() - (new Date(createdAt)).getTime()) / 1000)
        if (time > 86400) return Math.floor(time / 86400) + " DAYS AGO"
        if (time > 3600) return Math.floor(time / 3600) + " HOURS " + Math.floor(Math.floor(time % 3600) / 60) + " MINS AGO"
        if (time > 60) return Math.floor(time / 60) + " MINS AGO"
        if (time < 60) return "NOW"
    }

    return (
        <>
            {!userStatus ?
                <div className='px-8 my-6'>
                    <div className="text-white text-[24px] font-bold">YOU ARE NOT A MEMBER OF ANY GUILD<span className='text-[#ffff19]'>!</span></div>
                    <div className="text-[#E5E5E5] text-[14px] font-[400]">GUILD INFOMATION WILL BE DISPLAYED HERE AFTER YOU JOIN OR CREATE YOUR GUILD</div>
                    <div className="flex justify-between items-center">
                        <div className="flex-mid flex-col gap-y-2 w-[380px] h-[300px] mt-12 mb-0 border-[1px] border-[#000000]/[0.2] rounded-2xl backdrop-blur-md" style={{ backgroundImage: "radial-gradient(rgba(38, 38, 38, 0.6), rgba(86, 86, 86, 0.6))" }}>
                            <img alt="" draggable="false" src="/assets/images/shadow1.png" className='absolute w-[350px]' />
                            <div className='text-white z-10'>JOIN AN EXISTING GUILD</div>
                            <Button className='w-60' onClick={() => !userStatus ? null : setChatPart(true)}>
                                <img alt="" draggable="false" src="/assets/images/buy-btn.png" />
                                <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                                    JOIN A GUILD
                                </p>
                            </Button>
                        </div>
                        <div className="flex-mid relative flex-col gap-y-2 w-[380px] h-[300px] mt-12 mb-0 border-[1px] border-[#000000]/[0.2] rounded-2xl backdrop-blur-md" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.6), rgba(29, 29, 29, 0.6))" }}>
                            <img alt="" draggable="false" src="/assets/images/shadow3.png" className='absolute w-[270px]' />
                            <div className='text-white z-10'>CREATE YOUR GUILD</div>
                            <Button className='w-60' onClick={() => setNav("create")}>
                                <img alt="" draggable="false" src="/assets/images/big-button.png" />
                                <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                                    CREATE GUILD
                                </p>
                            </Button>
                            <div className='absolute bottom-20 flex-mid text-white text-[14px]'>
                                PRICE: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> 50 CSC
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className='flex-mid justify-between w-full h-[80px] bg-[#000000]/[0.25] px-8'>
                        <div className='flex-mid gap-x-2'>
                            <img alt="" draggable="false" className='w-[60px]' src={`${process.env.REACT_APP_API_URL}/${userGuild.image}`} />
                            <div className='flex-mid flex-col items-start text-white'>
                                <div className='text-[14px] font-bold'>{userGuild.title}</div>
                                <div className='flex-mid text-[12px]'>TOTAL EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {userGuild.earnAmount} CSC</div>
                            </div>
                        </div>
                        <Button className='w-44' onClick={() => onLeave()}>
                            <img alt="" draggable="false" src="/assets/images/leave-btn.png" />
                            <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                                LEAVE
                            </p>
                        </Button>
                    </div>
                    <div className="flex justify-between items-center px-8">
                        <div className="flex justify-start items-center relative flex-col gap-y-2 w-[380px] h-[380px] mt-2 border-[1px] border-[#31333C] rounded-xl backdrop-blur-md text-white" style={{ boxShadow: "inset 0 0px 8px 0 #000000ab" }}>
                            <div className='flex-mid justify-between absolute top-0 bg-[#000000]/[0.25] w-full h-8 rounded-t-xl px-4'>
                                <div className='text-[14px]'>CHAT</div>
                                <div className='text-[10px]'>LAST 50 MESSAGES</div>
                            </div>
                            <div className='w-full h-[17.5rem] px-2 mt-10 overflow-y-auto'>
                                {msgData.map((item, index) => (
                                    <div key={index}>
                                        <div className='flex justify-between items-center gap-x-4'>
                                            <div className={`text-[14px] ${global.walletAddress.toLowerCase() === item.user ? "text-[#D04AFF] font-bold" : userGuild.creator.toLowerCase() === item.user ? "text-[#2ac736] font-bold" : "text-[#fee53a]"}`}>{global.walletAddress.toLowerCase() === item.user ? "YOU" : item.user.slice(0, 4) + " ... " + item.user.slice(-4)}:</div>
                                            <div className='text-[10px] text-[#BCBCBC]'>
                                                {time(item.createdAt)}
                                            </div>
                                        </div>
                                        <div className='text-white text-[11px] text-left ml-6 break-words'>{item.detail}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='absolute bottom-0 bg-[#000000]/[0.25] w-full h-12 rounded-b-xl p-2'>
                                <input
                                    className={`border-[#fafafa]/[0.2] border-[1px] rounded-lg bg-[#000000]/[0.2] text-[14px] text-[#888888] w-full h-full ${remainTime > 0 ? "text-right" : ""}`}
                                    name="message"
                                    value={remainTime > 0 ? convertSecToHMS(remainTime) : message}
                                    placeholder='ENTER YOUR MESSAGE...'
                                    onChange={(e) => remainTime > 0 ? null : setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onMessage();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-[380px] h-[380px] mt-2 text-white overflow-y-auto">
                            <div className='flex-mid justify-between w-full'>
                                <div className='text-[12px]'>PLAYERS:</div>
                                <div className='text-[12px]'>{userGuild.members.length}/{userGuild.totalMembers}</div>
                            </div>
                            {userGuild.members.map((item, index) => (
                                <div key={index} className='flex-mid justify-between p-2 bg-[#9C97B5]/[0.4] border-[1px] border-[#16171D]/[0.5] rounded-lg w-full h-10 mt-[0.1rem]'>
                                    <div className={`text-[14px] ${userGuild.creator === item.address.toLowerCase() ? "text-[#2ac736] font-bold" : ""}`}>{item.address.slice(0, 4) + " ... " + item.address.slice(-4)}</div>
                                    <div className='flex-mid text-[12px]'>EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {item.earn} CSC</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default MinePart;