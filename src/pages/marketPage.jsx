import { useEffect, useState } from "react";
import styles from './Main/Main.module.scss'
import { global } from "../common/global";
import { LazyLoadImage } from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';
import Web3 from 'web3'
import { buyCharacterAndWeapon } from "../store/user/actions";
import { useWeb3Context } from "../hooks/web3Context";
import { HeaderComponent } from "../components";
import { useNavigate } from "react-router-dom";

export const MarketPage = (props) => {
    const navigate = useNavigate();
    const { address } = useWeb3Context()
    const characterData = [
        { characterNo: 1, name: "Sakura", src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/1-dxSqH5RqoAF0FmHDZDZtoNZqshr4MZ.gif", price: 300, common: 0, rare: 80, legend: 20 },
        { characterNo: 2, name: "Rena", src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/2-eqE9y7IXKZRou5NJf6LGHgPgoivqgY.gif", price: 200, common: 70, rare: 20, legend: 10 },
        { characterNo: 3, name: "Motoko", src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/3-Enr2FgCVbtXJTKmB3a7rEDZ7lpFkE8.gif", price: 3000, common: 0, rare: 0, legend: 0 },
        { characterNo: 4, name: "Hayate", src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/4-fIWCjNpJg2gJHqstmQk6VlVsjHYxwz.gif", price: 4000, common: 0, rare: 0, legend: 0 },
    ]
    const weaponData = [
        { weaponNo: 1, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/1-wealNs0p2pcxIkp2aYyaIf3KVy5Th4.png", price: 1000 },
        { weaponNo: 2, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/2-OdJq1J94fa7qGU6GVxdrhk43yhLEep.png", price: 2000 },
        { weaponNo: 3, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/3-OkqsVHlthxdYOYUGZrLZYhAcwJ25Bn.png", price: 3000 },
        { weaponNo: 4, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/4-uhuwsQrzI6x7eZOLo1xSvG834YCtp0.png", price: 4000 },
        { weaponNo: 5, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/5-7Y89HBUbTHhAzPw4s68HqlVuUHewZX.png", price: 4000 },
        { weaponNo: 6, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/6-vC9wOXJUJ9j6QeZ7qzFmN8K2G3QA2i.png", price: 5000 },
        { weaponNo: 7, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/7-t5mPhvKlnLW1JqIjoGvAnmX86OhRjZ.png", price: 6000 },
        { weaponNo: 8, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/8-PbbBpdgZEOwTPzej1EqCEl2WeFMkvm.png", price: 7000 },
        { weaponNo: 9, src: "https://iksqvifj67dwchip.public.blob.vercel-storage.com/weapon/9-9CPJSnJ30ZuxdC0uKMh1T5oHdruiIr.png", price: 8000 },
    ]
    const [nav, setNav] = useState("market");
    const [characterIndex, setCharacterIndex] = useState({ first: 0, last: 2 })
    const [presentCharacter, setPresentCharacter] = useState(characterData.slice(0, 2))
    const [weaponIndex, setWeaponIndex] = useState({ first: 0, last: 4 })
    const [presentWeapon, setPresentWeapon] = useState(weaponData.slice(0, 4))
    const [loaded1, setLoaded1] = useState(false)
    const [loaded2, setLoaded2] = useState(false)
    const [loaded3, setLoaded3] = useState(false)
    const [loaded4, setLoaded4] = useState(false)
    const [rarityStatus, setRarityStatus] = useState(-1);
    const [purchasedCha, setPurchasedCha] = useState([]);

    useEffect(() => {
        if (global.walletAddress !== "") {
            const cur = global.characters.map(character => character.characterNo);
            setPurchasedCha(cur);
            var priceInterval = setInterval(async () => { // Make the arrow function async
                let web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (global.walletAddress !== accounts[0]) {
                    window.location.reload();
                }
            }, 1000);

            return () => clearInterval(priceInterval);
        }
    }, []);
    const onPrevious = (from) => {
        if (from === "character") {
            if (characterIndex.first <= 0) return;
            setCharacterIndex({ first: characterIndex.first - 1, last: characterIndex.last - 1 });
            setPresentCharacter(characterData.slice(characterIndex.first - 1, characterIndex.last - 1))
        }
        if (from === "weapon") {
            if (weaponIndex.first <= 0) return;
            setWeaponIndex({ first: weaponIndex.first - 4, last: weaponIndex.last - 4 });
            setPresentWeapon(weaponData.slice(weaponIndex.first - 4, weaponIndex.last - 4))
        }
    }

    const onNext = (from) => {
        if (from === "character") {
            if (characterIndex.last >= 4) return;
            setCharacterIndex({ first: characterIndex.first + 1, last: characterIndex.last + 1 });
            setPresentCharacter(characterData.slice(characterIndex.first + 1, characterIndex.last + 1))
        }
        if (from === "weapon") {
            if (weaponIndex.last >= 9) return;
            setWeaponIndex({ first: weaponIndex.first + 4, last: weaponIndex.last + 4 });
            setPresentWeapon(weaponData.slice(weaponIndex.first + 4, weaponIndex.last + 4))
        }
    }

    const onBuy = (from, obj) => {
        if (obj.characterNo >= 3) {
            alert("Please wait...")
            return;
        }
        buyCharacterAndWeapon(address, from, obj).then(res => {
            if (res.data === false) {
                alert(res.message);
                return;
            }
            console.log(res)
            global.characters = res.data.characters;
        })
    }

    useEffect(() => {
        // console.log(loaded1, loaded2, loaded3, loaded4)
    }, [presentCharacter])
    const setLoading = (index) => {
        console.log(index)
    }

    const onMain = () => {
        navigate("/", { replace: true });
    }

    return (
        <>
            {!address && <div className="absolute w-full"><HeaderComponent onModalShow={props.onModalShow} /></div>}
            <img src='assets/images/come-back.png' draggable="false" className='absolute top-12 right-12 cursor-pointer w-[5.5rem] z-10' onClick={() => onMain()} />
            <div className="marketPage w-full h-full min-w-[1600px] min-h-[900px] overflow-auto text-white font-semibold flex flex-col justify-center items-center">
                <div className="flex justify-start items-center gap-x-4 translate-y-8 w-[900px] z-10">
                    <div className={`relative w-[160px] h-[50px] flex justify-center items-center cursor-pointer duration-300 ${nav === "market" ? "" : "brightness-50 opacity-80 text-[#d5d5d5]"}`} onClick={() => setNav("market")}>
                        <img src={`assets/images/${nav === "market" ? "nav-btn" : "nav-in-btn"}.webp`} draggable="false" className="w-full h-full" />
                        <div className="absolute">MARKET</div>
                    </div>
                    <div className={`relative w-[200px] h-[50px] flex justify-center items-center cursor-pointer duration-300 ${nav === "place" ? "" : "brightness-50 opacity-80 text-[#d5d5d5]"}`} onClick={() => setNav("place")}>
                        <img src={`assets/images/${nav === "place" ? "nav-btn" : "nav-in-btn"}.webp`} draggable="false" className="w-full h-full" />
                        <div className="absolute">MARKET PLACE</div>
                    </div>
                    <div className={`relative w-[160px] h-[50px] flex justify-center items-center cursor-pointer duration-300 ${nav === "sell" ? "" : "brightness-50 opacity-80 text-[#d5d5d5]"}`} onClick={() => setNav("sell")}>
                        <img src={`assets/images/${nav === "sell" ? "nav-btn" : "nav-in-btn"}.webp`} draggable="false" className="w-full h-full" />
                        <div className="absolute">SELL</div>
                    </div>
                </div>
                <div className="main-bg w-[1200px] h-[750px] flex flex-col items-center z-[1]">
                    <div className="w-[860px] flex justify-center items-center gap-x-6 mt-40 me-4">
                        <div className="flex flex-col justify-center items-center gap-y-8">
                            <div className="flex justify-center items-center gap-x-6">
                                {presentCharacter.map((item, index) => (
                                    <div key={index} className="relative w-[266px] h-[400px] bg-[#000000]/[0.6] rounded-lg flex flex-col justify-center items-center">
                                        <img src={`assets/images/character-bg.webp`} draggable="false" className="w-full h-[82%] rounded-t-lg" />
                                        <div className="absolute top-0 w-full h-8 rounded-t-lg bg-[#000000]/[0.6] flex justify-between items-center">
                                            <div className="w-[145px] h-full flex justify-center items-center">
                                                <img src={`assets/images/name-bg.webp`} draggable="false" className="w-full h-full" />
                                                <div className="absolute">{item.name}</div>
                                            </div>
                                            <div className="flex justify-center items-center text-[12px] me-2">
                                                <img alt="" className='w-[18px] mx-[7px]' src="assets/images/cryptoIcon.png" />
                                                {item.price} CSC
                                            </div>
                                        </div>
                                        <div className={`absolute top-16 ${(item.characterNo === 1 || item.characterNo === 4) ? "w-40" : item.characterNo === 2 ? "w-32" : "w-56"}`}>
                                            <LazyLoadImage
                                                key={item.src} src={item.src} loading="lazy" effect="blur" draggable="false" className="w-full h-full"
                                                onMouseOver={() => setRarityStatus(index)}
                                                onMouseOut={() => setRarityStatus(-1)}
                                            />
                                        </div>
                                        <div className={`absolute ${rarityStatus === index ? "" : "hidden"} ${styles.icons} bottom-20 text-[1.3rem]`}
                                            onMouseOver={() => setRarityStatus(index)}
                                            onMouseOut={() => setRarityStatus(-1)}
                                        >
                                            <div className={`${item.common === 0 ? "hidden" : ""}`}>COMMON-{item.common}%</div>
                                            <div className={`${item.rare === 0 ? "hidden" : ""}`}>RARE-{item.rare}%</div>
                                            <div className={`${item.legend === 0 ? "hidden" : ""}`}>LEGENDARY-{item.legend}%</div>
                                        </div>
                                        <div className="w-full h-[18%] flex justify-center items-center">
                                            {global.characters.some(character => character.characterNo === item.characterNo - 1 && character.rarity >= 2) ?
                                                <img
                                                    src={`assets/images/buy-button.png`} draggable="false"
                                                    className={`cursor-pointer grayscale`}
                                                />
                                                :
                                                <img
                                                    src={`assets/images/buy-button.png`} draggable="false"
                                                    className={`cursor-pointer ${global.characters.some(character => character.characterNo === item.characterNo - 1 && character.rarity >= 2) ? "grayscale" : ""}`}
                                                    onClick={() => onBuy("character", item)}
                                                />
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center gap-x-4">
                                <img src="assets/images/left_purple.png" className={`${styles.arrow} w-[40px] cursor-pointer`} alt="" draggable="false" onClick={() => onPrevious("character")} />
                                <div className="w-2 text-center">{characterIndex.first + 1}</div>
                                <img src="assets/images/right_purple.png" className={`${styles.arrow} w-[40px] cursor-pointer`} alt="" draggable="false" onClick={() => onNext("character")} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-y-8">
                            <div className="w-[266px] h-[400px] flex flex-wrap justify-between items-start gap-y-4">
                                {presentWeapon.map((item, index) => (
                                    <div key={index} className="w-[125px] h-[192px] bg-black rounded-lg">
                                        <div className="w-full h-2/3 rounded-t-lg">
                                            <LazyLoadImage key={item.src} src={item.src} loading="lazy" effect="blur" draggable="false" className="w-full h-full rounded-t-lg" />
                                        </div>
                                        <div className="w-full h-1/3 flex flex-col justify-center items-center gap-y-1">
                                            <div className="flex justify-center items-center gap-x-2 text-[12px]">
                                                <img alt="" className='w-[18px]' src="assets/images/cryptoIcon.png" />
                                                {item.price} CSC
                                            </div>
                                            <img src={`assets/images/buy-button.png`} draggable="false" className="cursor-pointer w-28" onClick={() => onBuy("weapon", item)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center gap-x-4">
                                <img src="assets/images/left_purple.png" className={`${styles.arrow} w-[40px] cursor-pointer`} alt="" draggable="false" onClick={() => onPrevious("weapon")} />
                                <div className="w-2 text-center">{Math.floor(weaponIndex.first / 4) + 1}</div>
                                <img src="assets/images/right_purple.png" className={`${styles.arrow} w-[40px] cursor-pointer`} alt="" draggable="false" onClick={() => onNext("weapon")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}