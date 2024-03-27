import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import { createGuildField, getGuild } from '../../store/user/actions';
import { global } from '../../common/global';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { LazyLoadImage } from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';

const freeList = ["siren1", "siren2", "siren3", "siren4", "siren5"]

const CreatePart = (props) => {
    const dispatch = useDispatch();
    const userModule = useSelector((state) => state.userModule)
    const [name, setName] = useState("");
    const [nameExist, setNameExist] = useState(false);
    const [nameFree, setNameFree] = useState(false);
    const [inputFile, setInputFile] = useState("");
    const [imgLoading, setImgLoading] = useState(false);
    const [guildList, setGuildList] = useState([]);

    useEffect(() => {
        if (global.walletAddress !== '' && props.nav === "create") {
            getGuild(global.walletAddress).then(res => {
                if (res.success && res.data) {
                    setGuildList(res.data)
                } else {
                    alert(res.message)
                }
            })
        }
    }, [props.nav])

    useEffect(() => {
        if (name !== "") {
            let status = false
            for (let i = 0; i < guildList.length; i++) {
                if (guildList[i].title === name) {
                    status = true;
                }
            }
            setNameExist(status)
            if (freeList.includes(name)) {
                setNameFree(true);
            } else {
                setNameFree(false);
            }
        }
    }, [name])

    const fileInput = (event) => {
        let maxFileSize = 5 * 1024 * 1024;
        if (event.target.files[0].size > maxFileSize) {
            alert("File is too large...")
            return;
        }
        setImgLoading(true);
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/upload`, formData)
            .then(res => {
                setInputFile(res.data.slice(7, res.data.length))
                setImgLoading(false);
            })
    }

    const createGuild = () => {
        if (userModule.claimedCSC < 50) {
            alert("CSC token not enough!")
            return;
        }
        if (name === "") {
            alert("Please input guild name!")
            return;
        }
        if (name.length < 3 || name.length > 10) {
            alert("Max name length is 10, min 3!")
            return;
        }
        if (inputFile === "") {
            alert("Please input file!")
            return;
        }
        dispatch(
            createGuildField(global.walletAddress, inputFile, name, (res) => {
                console.log(res)
                if (res.success && res.data) {
                    setInputFile("");
                    setName("");
                    alert("Create successfully!")
                } else {
                    alert(res.message);
                }
            }),
        )
    }

    return (
        <div className='flex-mid flex-col h-full'>
            <div className="text-white text-[24px] font-bold">CREATE YOUR GUILD</div>
            <div className="text-[#ffff19] text-[14px] font-[400] flex-mid mt-2">GUILD BOUNS: <span className='text-white'> +10% CSC EARN</span></div>
            <div className='flex-mid mt-16 mb-12 gap-x-6'>
                <div className='flex-mid relative w-32 h-32 bg-[#ffffff]/[0.4] rounded-lg border-[1px] border-[#464646] text-[47px] font-serif'>
                    {imgLoading ?
                        <span className="loader"></span> :
                        <>
                            {inputFile === "" ?
                                "+" :
                                <LazyLoadImage
                                    src={`${process.env.REACT_APP_API_URL}/${inputFile}`}
                                    loading="lazy"
                                    effect="blur"
                                    draggable="false"
                                    width={'100%'} height={'100%'}
                                    className='w-full h-full rounded-md object-cover'
                                />
                            }
                            <label className='absolute w-full h-full cursor-pointer' htmlFor="myInput"></label>
                            <input className='absolute w-full h-full hidden' id='myInput' type='file' accept='image/*' onChange={(e) => fileInput(e)} />
                        </>
                    }
                </div>
                <div className='relative flex-mid flex-col items-start gap-y-2'>
                    <div className='text-white'>GUILD NAME</div>
                    <input
                        className={`${nameExist ? "border-[#FF1E1E]" : nameFree ? "border-[#52FF52]" : "border-[#fafafa]/[0.2]"}  border-[1px] rounded-lg bg-[#FFFFFF] text-[14px] text-[#847D87] w-[320px]`}
                        name="name"
                        value={name}
                        placeholder='ENTER A NAME FOR YOUR GUILD...'
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={`absolute top-20 text-[14px] ${nameExist ? "text-[#FF1E1E]" : "text-[#52FF52]"} ${(nameExist || nameFree) ? "block" : "hidden"}`}>{nameExist ? "THIS NAME IS ALREADY TAKEN" : "THIS NAME IS FREE"}</div>
                </div>
            </div>
            <Button className={`w-60 ${!nameExist ? "" : "grayscale"}`} onClick={createGuild}>
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