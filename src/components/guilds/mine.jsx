import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import { global } from '../../common/global';
import { addMessage, getGuild } from '../../store/user/actions';

const playersList = [
    { walletAddress: "0x1cb6fc66926224ee12d4714a2a1e8f2ca509f0c1", amount: 6847 },
    { walletAddress: "0x29704734361342a7f394f1867fd084b538b75ee2", amount: 6847 },
    { walletAddress: "0x2710A268e7e5084bf26F5c3FD38bfb0D7b7703D2", amount: 6847 },
    { walletAddress: "0xc82e68ffe6adb374d931c388591b88c2bfd9b9c8", amount: 6847 },
    { walletAddress: "0xd96c138d331f32f643795ceedc88a70977476434", amount: 6847 },
    { walletAddress: "0x96ca266261f828bab32e800f5797f0edc2cce66f", amount: 6847 },
    { walletAddress: "0x1cb6fc66926224ee12d4714a2a1e8f2ca509f0c1", amount: 6847 },
    { walletAddress: "0x29704734361342a7f394f1867fd084b538b75ee2", amount: 6847 },
    { walletAddress: "0x8f515cab982c101a31f730138c69be797a928023", amount: 6847 },
    { walletAddress: "0xc82e68ffe6adb374d931c388591b88c2bfd9b9c8", amount: 6847 },
    { walletAddress: "0xd96c138d331f32f643795ceedc88a70977476434", amount: 6847 },
    { walletAddress: "0x96ca266261f828bab32e800f5797f0edc2cce66f", amount: 6847 },
]

const MinePart = (props) => {
    const [chatPart, setChatPart] = useState(false);
    const [message, setMessage] = useState("")
    const [msgData, setMsgData] = useState([])
    const [guildList, setGuildList] = useState([]);
    const [currentGuild, setCurrentGuild] = useState({})

    useEffect(() => {
        if (global.walletAddress !== '' && props.nav === "mine") {
            getGuild(global.walletAddress).then(res => {
                if (res.success && res.data) {
                    setGuildList(res.data)
                    setMsgData(res.data[0].messages)
                    setCurrentGuild(res.data[0]);
                } else {
                    alert(res.message)
                }
            })
        }
    }, [props.nav])

    const onMessage = () => {
        if (message === "") {
            alert("Please input message...")
            return;
        }
        addMessage(global.walletAddress, message, currentGuild).then(res => {
            let currentArray = guildList;
            currentArray[0] = res.data;
            setGuildList(currentArray);
            setMsgData(res.data.messages);
            setMessage("")
        })
    }

    const leaveGuild = () => {

    }

    return (
        <>
            {!chatPart ?
                <div className='px-8 my-6'>
                    <div className="text-white text-[24px] font-bold">YOU ARE NOT A MEMBER OF ANY GUILD<span className='text-[#ffff19]'>!</span></div>
                    <div className="text-[#E5E5E5] text-[14px] font-[400]">GUILD INFOMATION WILL BE DISPLAYED HERE AFTER YOU JOIN OR CREATE YOUR GUILD</div>
                    <div className="flex justify-between items-center">
                        <div className="flex-mid flex-col gap-y-2 w-[380px] h-[300px] mt-12 mb-0 border-[1px] border-[#000000]/[0.2] rounded-2xl backdrop-blur-md" style={{ backgroundImage: "radial-gradient(rgba(38, 38, 38, 0.6), rgba(86, 86, 86, 0.6))" }}>
                            <img alt="" draggable="false" src="/assets/images/shadow1.png" className='absolute w-[350px]' />
                            <div className='text-white z-10'>JOIN AN EXISTING GUILD</div>
                            <Button className='w-60' onClick={() => setChatPart(true)}>
                                <img alt="" draggable="false" src="/assets/images/buy-btn.png" />
                                <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                                    JOIN A GUILD
                                </p>
                            </Button>
                        </div>
                        <div className="flex-mid relative flex-col gap-y-2 w-[380px] h-[300px] mt-12 mb-0 border-[1px] border-[#000000]/[0.2] rounded-2xl backdrop-blur-md" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.6), rgba(29, 29, 29, 0.6))" }}>
                            <img alt="" draggable="false" src="/assets/images/shadow3.png" className='absolute w-[270px]' />
                            <div className='text-white z-10'>CREATE YOUR GUILD</div>
                            <Button className='w-60' onClick={() => props.setNav("create")}>
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
                            <img alt="" draggable="false" className='w-[60px]' src="assets/character/list/list1.png" />
                            <div className='flex-mid flex-col items-start text-white'>
                                <div className='text-[14px] font-bold'>GUILD NAME</div>
                                <div className='flex-mid text-[12px]'>TOTAL EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> 6874 CSC</div>
                            </div>
                        </div>
                        <Button className='w-44' onClick={() => leaveGuild()}>
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
                                        <div className='flex justify-start items-center gap-x-4'>
                                            <div className={`text-[14px] ${global.walletAddress.toLowerCase() === item.user ? "text-[#D04AFF]" : currentGuild.creator.toLowerCase() === item.user ? "text-[#2ac736]" : "text-[#fee53a]"}`}>{global.walletAddress.toLowerCase() === item.user ? "YOU" : item.user.slice(0, 4) + " ... " + item.user.slice(-4)}:</div>
                                            <div className='text-[10px] text-[#BCBCBC]'>{item.createdAt}</div>
                                        </div>
                                        <div className='text-white text-[11px] text-left ml-6'>{item.detail}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='absolute bottom-0 bg-[#000000]/[0.25] w-full h-12 rounded-b-xl p-2'>
                                <input
                                    className={`border-[#fafafa]/[0.2] border-[1px] rounded-lg bg-[#000000]/[0.2] text-[14px] text-[#888888] w-full h-full`}
                                    name="message"
                                    value={message}
                                    placeholder='ENTER YOUR MESSAGE...'
                                    onChange={(e) => setMessage(e.target.value)}
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
                                <div className='text-[12px]'>9/40</div>
                            </div>
                            {playersList.map((item, index) => (
                                <div key={index} className='flex-mid justify-between p-2 bg-[#9C97B5]/[0.4] border-[1px] border-[#16171D]/[0.5] rounded-lg w-full h-10 mt-[0.1rem]'>
                                    <div className={`text-[14px] ${currentGuild.creator === item.walletAddress.toLowerCase() ? "text-[#2ac736]" : ""}`}>{item.walletAddress.slice(0, 4) + " ... " + item.walletAddress.slice(-4)}</div>
                                    <div className='flex-mid text-[12px]'>EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {item.amount} CSC</div>
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