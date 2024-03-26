import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';

const CreatePart = () => {
    const [name, setName] = useState("");
    const [nameExist, setNameExist] = useState(false);
    const [nameFree, setNameFree] = useState(false);
    const [createAvailable, setCreateAvailable] = useState(true);

    useEffect(() => {
        if (name === "1") setNameExist(true);
        else if (name === "2") setNameFree(true);
        else {
            setNameExist(false);
            setNameFree(false);
        }
    }, [name])

    useEffect(() => {
        if (name === "" || name === "1") setCreateAvailable(false);
        else {
            setCreateAvailable(true);
        }
    }, [name])

    return (
        <div className='flex-mid flex-col h-full'>
            <div className="text-white text-[24px] font-bold">CREATE YOUR GUILD</div>
            <div className="text-[#ffff19] text-[14px] font-[400] flex-mid mt-2">GUILD BOUNS: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /><span className='text-white'> 3200 CSC</span></div>
            <div className='flex-mid mt-16 mb-12 gap-x-6'>
                <div className='flex-mid w-32 h-32 bg-[#ffffff]/[0.4] rounded-lg border-[1px] border-[#464646] text-[47px] font-serif'>+</div>
                <div className='relative flex-mid flex-col items-start gap-y-2'>
                    <div className='text-white'>GUILD NAME</div>
                    <input
                        className={`${nameExist ? "border-[#FF1E1E]" : nameFree ? "border-[#52FF52]" : "border-[#fafafa]/[0.2]"}  border-[1px] rounded-lg bg-[#FFFFFF] text-[14px] text-[#847D87] w-[320px]`}
                        name="name"
                        placeholder='ENTER A NAME FOR YOUR GUILD...'
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={`absolute top-20 text-[14px] ${nameExist ? "text-[#FF1E1E]" : "text-[#52FF52]"} ${(nameExist || nameFree) ? "block" : "hidden"}`}>{nameExist ? "THIS NAME IS ALREADY TAKEN" : "THIS NAME IS FREE"}</div>
                </div>
            </div>
            <Button className={`w-60 ${createAvailable ? "" : "grayscale"}`}>
                <img alt="" draggable="false" src="/assets/images/big-button.png" />
                <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                    CREATE GUILD
                </p>
            </Button>
            <div className='flex-mid text-white text-[14px]'>
                PRICE: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> 50 CSC
            </div>
        </div>
    );
}

export default CreatePart;