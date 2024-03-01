import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from './Main/Main.module.scss'
import { useWeb3Context } from "../hooks/web3Context";
import { buyRewardAvailable, claimReward, getRewardWithLevel } from "../store/user/actions";
import { HeaderComponent } from "../components";
import { TextWithNumberColor } from "../components/textWithNumberColor";
import { Transaction } from "../utils/transaction";

const initialLevelData = [
    { level: 1, image: "assets/images/rock.png", value: "X30", getStatus: false, available: false, title1: "WIN 1 FIGHT IN PVE", title2: "30X RESOURCES" },
    { level: 2, image: "assets/images/cryptoIcon.png", value: "X15", getStatus: false, available: false, title1: "OPEN CHEST", title2: "15X CSC" },
    { level: 3, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: false, available: false, title1: "BUY A TAVERN", title2: "20X CSC" },
    { level: 4, image: "assets/images/weapon/3.png", value: "", getStatus: false, available: false, title1: "GET 200 WATER", title2: "RANDOM WEAPON" },
    { level: 5, image: "assets/images/claim-box.png", value: "X2", getStatus: false, available: false, title1: "WIN IN 4 ROOMS IN THE FIRST LOCATION", title2: "2X CHESTS" },
    { level: 6, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: false, available: false, title1: "WIN 20 BATTLES", title2: "20X CSC" },
    { level: 7, image: "images/res_res.png", value: "X65", getStatus: false, available: false, title1: "EARN 1500 TEST CSC", title2: "65X RESOURCES" },
    { level: 8, image: "assets/images/cryptoIcon.png", value: "X50", getStatus: false, available: false, title1: "BUY 110 CSC TOKEN", title2: "50X RESOURCES, 50X WATER, 50X CSC" },
    { level: 9, image: "assets/images/claim-box.png", value: "X2", getStatus: false, available: false, title1: "OPEN 7 CHESTS", title2: "2X CHESTS" },
    { level: 10, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: false, available: false, title1: "EARN 3500 TEST CSC", title2: "20X CSC, 75X RESOURCES" },
    { level: 11, image: "assets/images/weapon/6.png", value: "", getStatus: false, available: false, title1: "GET 500 WATER", title2: "RANDOM WEAPON" },
    { level: 12, image: "assets/images/cryptoIcon.png", value: "X100", getStatus: false, available: false, title1: "BUY 220 CSC TOKEN", title2: "100X RESOURCES, 100X WATER, 100X CSC" },
    { level: 13, image: "assets/images/claim-box.png", value: "X3, X50", getStatus: false, available: false, title1: "GET 5000 TEST CSC", title2: "3X CHESTS, 50X WATER" },
    { level: 14, image: "assets/images/characters/avatar/2.png", value: "X1", getStatus: false, available: false, title1: "BUY 1110 CSC TOKEN", title2: "RANDOM CHARACTER" },
    { level: 15, image: "assets/images/characters/avatar/4.png", value: "X1", getStatus: false, available: false, title1: "GET 12000 TEST CSC, 5000 WATER, BUY 200+ CSC", title2: "RANDOM CHARACTER" },
]

export const BattlePass = (props) => {
    const { address, connect } = useWeb3Context()
    const navigate = useNavigate();
    const [rewardList, setRewardList] = useState([]);
    const [index, setIndex] = useState({ first: 0, last: 6 });
    const [presentData, setPresentData] = useState({
        level: ""
    });
    const [levelData, setLevelData] = useState([]);
    const [randomVal, setRandomVal] = useState([0, 0, 0, 0]);
    const [usdtVal, setUsdtVal] = useState(12);
    const [available, setAvailable] = useState(false);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        if (address === undefined || address === null || address === "") {
            setLevelData(initialLevelData);
            setPresentData(initialLevelData[0]);
            setRewardList(initialLevelData.slice(0, 6))
            getRandomValue();
        }
    }, [])
    useEffect(() => {
        // if (address === undefined || address === null || address === "") {
        //     return navigate("/", { replace: true });
        // }
        if (address !== undefined && address !== null && address !== "") {
            getRewardWithLevel(address).then(res => {
                setAvailable(res.available);
                let array = Object.values(res)
                let currentArray = [];
                for (let i = 0; i < array.length; i++) {
                    if (typeof array[i] === "object") {
                        currentArray.push(array[i]);
                    }
                };
                setLevelData(currentArray);
                setPresentData(currentArray[0]);
                setRewardList(currentArray.slice(0, 6))
                getRandomValue();
            })
        }
        const video = document.getElementById('backgroundVideo')
        video.style.display = "none"
    }, [address])

    useEffect(() => {
        if (address !== undefined && address !== null && address !== "") {
            for (let i = rewardList.length - 1; i >= 0; i--) {
                if (rewardList[i].getStatus === true) {
                    if (i === 5 && levelData[rewardList[5].level].getStatus === true) {
                        setPercent(7);
                    } else {
                        setPercent(i + 1);
                    }
                    return;
                }
            }
            setPercent(0);
        }
    }, [rewardList])

    const getRandomValue = () => {
        let rand1 = Math.floor((Math.random() * 10) + 1);
        if (rand1 === 10) rand1 = 4
        let rand2 = Math.floor((Math.random() * 10) + 1);
        if (rand1 === rand2) rand2 = rand2 + 3
        if (rand2 >= 10) rand2 = 7
        let rand = Math.floor(Math.random() * 100);
        let rand3, rand4;
        if (rand <= 33) { rand3 = 2; rand4 = 4 }
        if (rand >= 33 && rand < 67) { rand3 = 2; rand4 = 3 }
        if (rand >= 67) { rand3 = 3; rand4 = 4 }
        setRandomVal([rand1, rand2, rand3, rand4]);
    }
    const onMain = () => {
        navigate("/", { replace: true });
    }

    const onPrevious = () => {
        if (index.first <= 0) return;
        if (address === undefined || address === null || address === "") {
            setIndex({ first: index.first - 1, last: index.last - 1 })
            setRewardList(initialLevelData.slice(index.first - 1, index.last - 1))
            return
        }
        setIndex({ first: index.first - 1, last: index.last - 1 })
        setRewardList(levelData.slice(index.first - 1, index.last - 1))
    }
    const onNext = () => {
        if (index.last >= 15) return;
        if (address === undefined || address === null || address === "") {
            setIndex({ first: index.first + 1, last: index.last + 1 })
            setRewardList(initialLevelData.slice(index.first + 1, index.last + 1))
            return
        }
        setIndex({ first: index.first + 1, last: index.last + 1 })
        setRewardList(levelData.slice(index.first + 1, index.last + 1))
    }

    const onClaim = (presentData) => {
        console.log(presentData)
        if (presentData.level !== 1 && levelData[presentData.level - 2].getStatus === false) {
            alert("Can't claim reward of the level!");
            return;
        }
        claimReward(address, presentData, randomVal).then(res => {
            if (res.data === false) return alert(res.message);
            setPresentData(res.data.reward);
            let currentArray = levelData;
            currentArray[res.data.reward.level - 1] = res.data.reward;
            setLevelData(currentArray);
            setRewardList(currentArray.slice(index.first, index.last))
        })
    }

    const onBuy = async () => {
        if (address === "" || address === null || address === undefined) {
            alert("Please connect wallet!")
            return;
        }
        if (usdtVal < 12) {
            alert("Incorrect USDT value!")
            return;
        }
        let transaction = await Transaction(usdtVal);
        if (transaction === false) {
            return;
        }
        buyRewardAvailable(address, usdtVal, transaction).then(res => {
            if (res.data === false) return alert(res.message);
            setAvailable(res.data);
        })
    }

    return (
        <>
            {!address && <div className="absolute w-full"><HeaderComponent onModalShow={props.onModalShow} /></div>}
            <div className="battlePass w-full h-full min-w-[1600px] min-h-[900px] overflow-auto text-white font-semibold flex justify-center items-center">
                {/* <div className="battlePassCenter relative w-[95%] md:w-[80%] h-[90%] min-w-[884px] min-h-[497px] p-20"> */}
                <div className="battlePassCenter relative w-[1200px] h-[700px] px-[3.1rem] py-[3.7rem]">
                    <img src="assets/images/book.png" className="absolute -top-[3.5rem] translate-x-[250%] w-[15%]" alt="" draggable="false" />
                    <img src='assets/images/come-back.png' draggable="false" className='absolute top-0 right-[-1rem] cursor-pointer w-[5.5rem] z-10' onClick={() => onMain()} />
                    <div className="h-[45%] flex justify-center items-center pt-6 pl-12">
                        <div className="w-[55%] flex flex-col justify-around h-full">
                            <div className="text-[30px] italic">SEASON 0</div>
                            <div className="flex items-center">
                                <div className="me-4">
                                    <img src="assets/images/yellow_clock.png" className="w-[40px] h-full" alt="" draggable="false" />
                                </div>
                                <div className="text-start">
                                    <div className="text-md font-[500] text-gray-300">ENDS IN</div>
                                    <div className="text-2xl text-[#ffff19]">50 DAYS</div>
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <div className="me-3 text-[#ffff19] text-5xl text-bold">!</div>
                                <div className="tracking-[-1px] text-[15px] font-[600]">
                                    ALL REWARDS RECEIVED REMAIN WITH YOU FOREVER.<br />
                                    ITEMS FROM BATTLE PASS WILL NOT BE REMOVED AT RELEASE.<br />
                                    <span className="text-[#ff0000]">YOU WILL RECEIVE REWARDS FROM BP AT THE BETA VERSION START.</span>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.present} w-[45%] h-full p-4 pe-0`}>
                            <div className={`h-full w-full flex`}>
                                <div className={`w-[40%]`}>
                                    <div className={`relative w-full h-full flex flex-col justify-center items-center`}>
                                        <div className="w-36 h-40 p-2">
                                            <div
                                                className={
                                                    `${(presentData.level === 14 || presentData.level === 15) ?
                                                        styles.rewardBg2
                                                        :
                                                        (presentData.level === 5 || presentData.level === 9 || presentData.level === 13) ?
                                                            styles.rewardBg3
                                                            :
                                                            (presentData.level === 4 || presentData.level === 11) ?
                                                                "" : styles.rewardBg1
                                                    } 
                                                 w-full h-full flex flex-col justify-center items-center ${(presentData.level === 4 || presentData.level === 11) ? "p-0" : "p-4"}`
                                                }
                                            >
                                                {presentData.value === "" ?
                                                    <img src={presentData.getStatus === true ? presentData.image : `assets/images/weapon/${presentData.level === 4 ? randomVal[0] : randomVal[1]}.png`} draggable="false" className="rounded-xl border-1 border-black w-full h-full" style={{ boxShadow: "0 0 5px #FFA723" }} alt="" />
                                                    :
                                                    <>
                                                        {
                                                            presentData.level === 14 || presentData.level === 15 ?
                                                                <img src={presentData.getStatus === true ? presentData.image : `assets/images/characters/avatar/${presentData.level === 14 ? randomVal[2] : randomVal[3]}.png`} className="w-24" alt="" draggable="false" />
                                                                :
                                                                <img src={presentData.image} className="w-24" alt="" draggable="false" />
                                                        }
                                                        <div className="tracking-[-1px] my-1">{presentData.value}</div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        {presentData && presentData.level !== "" ?
                                            (presentData.getStatus === false && presentData.available === true ?
                                                <img src="assets/images/claim-btn.png" className={`w-20 my-1 cursor-pointer`} alt="" draggable="false" onClick={() => onClaim(presentData)} />
                                                :
                                                <img src="assets/images/inclaim-btn.png" className={`w-20 my-1 cursor-pointer`} alt="" draggable="false" />) : null
                                        }
                                    </div>
                                </div>
                                <div className="w-[60%] flex flex-col justify-center items-start">
                                    <div className="text-[20px] tracking-[2px] text-start pe-2" style={{ textShadow: "2px 2px 5px black" }}>QUEST</div>
                                    <div className="tracking-[-1px] my-3 text-start py-1 pe-2">{presentData && presentData.level !== "" ? <TextWithNumberColor text={presentData.title1} /> : null}</div>
                                    <div className="text-[20px] tracking-[2px] text-start pe-2" style={{ textShadow: "2px 2px 5px black" }}>REWARD</div>
                                    <div className="tracking-[-1px] my-3 text-start py-1 pe-2">{presentData && presentData.level !== "" ? <TextWithNumberColor text={presentData.title2} /> : null}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-[50%] flex justify-center items-center relative">
                        <div className="w-[10%] flex justify-center items-center cursor-pointer}" onClick={onPrevious}>
                            <img src="assets/images/left_arrow.png" className={`${styles.arrow} w-[70px]`} alt="" draggable="false" />
                        </div>
                        <div className="w-[80%] flex justify-between">
                            {rewardList.map((item, index) => (
                                <div className="flex flex-col items-center">
                                    {item.value === "" ?
                                        <div
                                            key={index}
                                            className={`w-36 h-40 p-3 flex flex-col justify-center items-center cursor-pointer ${item.available === true ? styles.shine : null}`}
                                            onClick={() => setPresentData(item)}
                                        >
                                            <img src={item.getStatus === true ? item.image : `assets/images/weapon/${item.level === 4 ? randomVal[0] : randomVal[1]}.png`} className={item.available === true ? `w-full h-full rounded-2xl` : `brightness-75 w-full h-full rounded-2xl`} alt="" draggable="false" />
                                            {item.getStatus === true ? <div className="absolute text-[20px]">CLAIMED</div> : null}
                                        </div>
                                        :
                                        <div
                                            key={index}
                                            className={`w-36 h-40 p-3 cursor-pointer ${item.available === true ? styles.shine : null}`}
                                            onClick={() => setPresentData(item)}
                                        >
                                            <div className={`${(item.level === 14 || item.level === 15) ?
                                                styles.rewardBg2
                                                :
                                                (item.level === 5 || item.level === 9 || item.level === 13) ?
                                                    styles.rewardBg3
                                                    :
                                                    (item.level === 4 || item.level === 11) ?
                                                        "" : styles.rewardBg1
                                                } w-full h-full flex flex-col justify-center items-center rounded-xl p-2`}>
                                                {
                                                    item.level === 14 || item.level === 15 ?
                                                        <img src={item.getStatus === true ? item.image : `assets/images/characters/avatar/${item.level === 14 ? randomVal[2] : randomVal[3]}.png`} className={item.available === true ? `w-24` : `brightness-75 w-24`} alt="" draggable="false" />
                                                        :
                                                        <img src={item.image} className={item.available === true ? `w-24` : `brightness-75 w-24`} alt="" draggable="false" />
                                                }
                                                <div className="mt-2">{item.value}</div>
                                                {item.getStatus === true ? <div className="absolute text-[20px]">CLAIMED</div> : null}
                                            </div>
                                        </div>
                                    }
                                    <div className={`${item.getStatus === true ? styles.numBtn : styles.numBtnIn} absolute top-56 z-10 w-[40px] h-[40px] flex justify-center items-center`}>{item.level}</div>
                                </div>
                            ))}
                        </div>
                        <div className="w-[10%] flex justify-center items-center cursor-pointer" onClick={onNext}>
                            <img src="assets/images/right_arrow.png" className={`${styles.arrow} w-[70px]`} alt="" draggable="false" />
                        </div>
                        <div className="absolute top-60 h-[10px] w-full bg-[#959595] rounded-full z-0"></div>
                        <div className="absolute top-60 h-[10px] w-full rounded-full z-[1] flex justify-start">
                            <div className={`h-full bg-[#00ce2d] rounded-full`} style={{ width: `${percent * 9.25 + 2.25}rem` }}></div>
                        </div>
                    </div>
                    <div className="h-[5%] flex items-end justify-center">
                        <div className={`${styles.usdtBg} w-36 h-8 flex justify-center items-center`}>
                            <img src="assets/images/usdt.png" className="w-[20px]" alt="" draggable="false" />
                            <span className="mx-[5px]">{usdtVal}</span>
                            <span className="text-[#00ce2d]">USDT</span>
                        </div>
                    </div>
                    <div
                        className={`${available === false ? styles.playBtn : null} absolute translate-x-[170%] bg-no-repeat h-[35px] w-[250px] flex justify-center items-center cursor-pointer`}
                        style={{ backgroundImage: "url(/assets/images/buy-btn.png)", backgroundSize: "100% 100%" }}
                        onClick={available === false ? onBuy : null}
                    >
                        {available === false ? "BUY BATTLE PASS" : "BOUGHT"}
                    </div>
                </div>
            </div>
        </>
    )
}
