import Button from '@mui/material/Button'

const guildList = [
    { image: "assets/character/list/list1.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list2.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list3.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list4.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list5.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list6.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list5.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
    { image: "assets/character/list/list6.png", name: "GUILD NAME", amount: 6847, players: 9, totalPlayers: 40, joinStatus: true },
]

const ListPart = () => {
    return (
        <div className='flex-mid flex-col gap-y-2'>
            {guildList.map((item, index) => (
                <div key={index} className='flex-mid justify-between gap-x-2 w-full h-16 rounded-lg border-[1px] border-[#CFD4FF]/[0.2] bg-[#9C97B5]/[0.4] text-white'>
                    <div className='flex-mid gap-x-2'>
                        <img alt="" draggable="false" className='w-[60px]' src={item.image} />
                        <div className='text-[14px] font-bold'>{item.name}</div>
                    </div>
                    <div className='flex-mid text-[12px]'>TOTAL EARN: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {item.amount} CSC</div>
                    <div className='text-[12px]'>PLAYERS: {item.players}/{item.totalPlayers}</div>
                    <Button className='w-44'>
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