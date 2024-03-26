import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import { getGuild, joinGuild } from '../../store/user/actions';
import { global } from '../../common/global';

const ListPart = (props) => {
    const [guildList, setGuildList] = useState([]);

    useEffect(() => {
        if (global.walletAddress !== '' && props.nav === "list") {
            getGuild(global.walletAddress).then(res => {
                if (res.success && res.data) {
                    setGuildList(res.data)
                } else {
                    alert(res.message)
                }
            })
        }
    }, [props.nav])
    const onJoin = (guild, index) => {
        joinGuild(global.walletAddress, guild).then(res => {
            if (res.success && res.data) {
                let currentArray = guildList;
                currentArray[index] = res.data;
                setGuildList(currentArray);
            } else {
                alert(res.message);
            }
        })
    }

    return (
        <div className='flex-mid flex-col gap-y-2'>
            {guildList.map((item, index) => (
                <div key={index} className='flex-mid justify-between gap-x-2 w-full h-16 rounded-lg border-[1px] border-[#CFD4FF]/[0.2] bg-[#9C97B5]/[0.4] text-white'>
                    <div className='flex-mid gap-x-2'>
                        <img alt="" draggable="false" className='w-[60px] rounded-full' src={`${process.env.REACT_APP_API_URL}/${item.image}`} />
                        <div className='text-[14px] font-bold'>{item.title}</div>
                    </div>
                    <div className='flex-mid text-[12px]'>TOTAL EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {item.earnAmount} CSC</div>
                    <div key={index} className='text-[12px]'>PLAYERS: {item.members.length}/{item.totalMembers}</div>
                    <Button className='w-44' onClick={() => onJoin(item, index)}>
                        <img alt="" draggable="false" src="/assets/images/buy-btn.png" />
                        <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                            JOIN
                        </p>
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default ListPart;