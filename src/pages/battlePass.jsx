import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from './Main/Main.module.scss'
import { useWeb3Context } from "../hooks/web3Context";
import { claimReward, getRewardWithLevel } from "../store/user/actions";

// const levelData = [
//     { level: 1, image: "assets/images/rock.png", value: "X30", getStatus: false, available: true, title1: "WIN 1 FIGHT IN PVE", title2: "30X RESOURCES" },
//     { level: 2, image: "assets/images/cryptoIcon.png", value: "X15", getStatus: false, available: false, title1: "OPEN CHEST", title2: "15X CSC" },
//     { level: 3, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: true, available: false, title1: "BUY A TAVERN", title2: "20X CSC" },
//     { level: 4, image: "assets/images/weapon/3.png", value: "", getStatus: true, available: true, title1: "GET 200 WATER", title2: "RANDOM WEAPON" },
//     { level: 5, image: "assets/images/claim-box.png", value: "X2", getStatus: false, available: true, title1: "WIN IN 4 ROOMS IN THE FIRST LOCATION", title2: "2X CHESTS" },
//     { level: 6, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: false, available: true, title1: "WIN 20 BATTLES", title2: "20X CSC" },
//     { level: 7, image: "images/res_res.png", value: "X65", getStatus: false, available: true, title1: "EARN 1500 TEST CSC", title2: "65X RESOURCES" },
//     { level: 8, image: "assets/images/claim-box.png", value: "X2", getStatus: false, available: true, title1: "BUY 110 CSC TOKEN", title2: "50X RESOURCES, 50X WATER, 50X CSC" },
//     { level: 9, image: "assets/images/cryptoIcon.png", value: "X20", getStatus: false, available: true, title1: "OPEN 7 CHESTS", title2: "2X CHESTS" },
//     { level: 10, image: "assets/images/cryptoIcon.png", value: "X65", getStatus: false, available: true, title1: "EARN 3500 TEST CSC", title2: "20X CSC, 75X RESOURCES" },
//     { level: 11, image: "assets/images/weapon/6.png", value: "", getStatus: false, available: true, title1: "GET 500 WATER", title2: "RANDOM WEAPON" },
//     { level: 12, image: "assets/images/cryptoIcon.png", value: "X65", getStatus: false, available: true, title1: "BUY 220 CSC TOKEN", title2: "100X RESOURCES, 100X WATER, 100X CSC" },
//     { level: 13, image: "assets/images/claim-box.png", value: "X2", getStatus: false, available: true, title1: "GET 5000 TEST CSC", title2: "3X CHESTS, 50X WATER" },
//     { level: 14, image: "assets/images/characters/avatar/2.png", value: "X20", getStatus: false, available: true, title1: "BUY 1110 CSC TOKEN", title2: "RANDOM CHARACTER" },
//     { level: 15, image: "assets/images/characters/avatar/4.png", value: "X65", getStatus: false, available: true, title1: "GET 12000 TEST CSC, 5000 WATER, BUY 200+ CSC", title2: "RANDOM CHARACTER" },
// ]

export const BattlePass = () => {
    const { address, connect } = useWeb3Context()
    const navigate = useNavigate();
    const [rewardList, setRewardList] = useState([]);
    const [index, setIndex] = useState({ first: 0, last: 5 });
    const [presentData, setPresentData] = useState([]);
    const [levelData, setLevelData] = useState([]);
    const [randomVal, setRandomVal] = useState([0, 0, 0, 0]);

    useEffect(() => {
        if (address === undefined || address === null || address === "") {
            return navigate("/", { replace: true });
        }

        getRewardWithLevel(address).then(res => {
            let array = Object.values(res)
            let currentArray = [];
            for (let i = 0; i < array.length; i++) {
                if (typeof array[i] === "object") {
                    currentArray.push(array[i]);
                }
            };
            setLevelData(currentArray);
            setPresentData(currentArray[0]);
            setRewardList(currentArray.slice(0, 5))

            let rand1 = Math.floor((Math.random() * 10) + 1);
            if (rand1 === 10) rand1 = 4
            let rand2 = Math.floor((Math.random() * 10) + 1);
            if (rand1 === rand2) rand2 = rand2 + 3
            if (rand2 >= 10) rand2 = 7
            let rand3 = Math.floor(Math.random() * 4);
            if (rand3 === 0) rand3 = 1
            let rand4 = Math.floor(Math.random() * 4);
            if (rand3 === rand4) rand4 = rand4 + 1
            if (rand4 >= 4) rand4 = 3
            setRandomVal([rand1, rand2, rand3, rand4]);
        })

        const video = document.getElementById('backgroundVideo')
        video.style.display = "none"
    }, [])

    const onMain = () => {
        navigate("/", { replace: true });
    }

    const onPrevious = () => {
        if (index.first <= 0) return;
        setIndex({ first: index.first - 1, last: index.last - 1 })
        setRewardList(levelData.slice(index.first - 1, index.last - 1))
    }
    const onNext = () => {
        if (index.last >= 15) return;
        setIndex({ first: index.first + 1, last: index.last + 1 })
        setRewardList(levelData.slice(index.first + 1, index.last + 1))
    }

    const onClaim = (presentData) => {
        claimReward(address, presentData, randomVal).then(res => {
            setPresentData(res.reward);
            let currentArray = levelData;
            currentArray[res.reward.level - 1] = res.reward;
            setLevelData(currentArray);
            setRewardList(currentArray.slice(index.first, index.last))
        })
    }

    return (
        <div className="battlePass w-full h-full min-w-[1600px] min-h-[900px] overflow-auto p-10 text-white  font-semibold">
            <img src='assets/images/come-back.png' draggable="false" className='fixed top-[10%] right-[7%] cursor-pointer w-[5%] z-10' onClick={() => onMain()} />
            <div className="h-[60%] flex">
                <div className="w-[45%] p-28 pe-8">
                    <div className="flex items-center">
                        <div className="me-4">
                            <img src="assets/images/yellow_clock.png" className="w-[40px] h-full" alt="" draggable="false" />
                        </div>
                        <div className="text-3xl">50 DAYS</div>
                    </div>
                    <div className="flex items-center mt-4">
                        <div className="me-3 text-[#ffff19] text-5xl text-bold">!</div>
                        <div className="tracking-[-1px] text-[15px]">ALL REWARDS RECEIVED REMAIN WITH YOU FOREVER.<br />ITEMS FROM BATTLE PASS WILL NOT BE REMOVED AT RELEASE</div>
                    </div>
                </div>
                <div className="w-[55%] p-20">
                    <div className="h-full opacity-95 w-[75%] max-w-[700px] bg-[#e4e2e2] rounded-[1.5rem] flex" style={{ boxShadow: "0 0 8px #333333" }}>
                        <div style={{ boxShadow: "0 0 15px #FFA723" }} className="w-1/2 bg-[#091520] rounded-[1.5rem] opacity-100 flex flex-col justify-center items-center">
                            {presentData.value === "" ?
                                <img src={presentData.getStatus === true ? presentData.image : `assets/images/weapon/${presentData.level === 4 ? randomVal[0] : randomVal[1]}.png`} draggable="false" className="w-[150px] m-4 rounded-xl border-1 border-black" style={{ boxShadow: "0 0 5px #FFA723" }} alt="" />
                                :
                                <>
                                    {
                                        presentData.level === 14 || presentData.level === 15 ?
                                            <img src={presentData.getStatus === true ? presentData.image : `assets/images/characters/avatar/${presentData.level === 14 ? randomVal[2] : randomVal[3]}.png`} className="w-[150px]" alt="" draggable="false" />
                                            :
                                            <img src={presentData.image} className="w-[150px]" alt="" draggable="false" />
                                    }
                                    <div className="tracking-[-1px] my-3">{presentData.value}</div>
                                </>
                            }
                            {
                                presentData.getStatus === false && presentData.available === true ?
                                    <img src="assets/images/claim-btn.png" className="w-[95px] cursor-pointer" alt="" draggable="false" onClick={() => onClaim(presentData)} />
                                    : null
                            }

                        </div>
                        <div className="w-1/2 flex flex-col justify-center items-center">
                            <div className="text-[20px] tracking-[2px] text-center" style={{ textShadow: "2px 2px 5px black" }}>QUEST</div>
                            <div className="tracking-[-1px] my-3 text-center py-1 px-3">{presentData.title1}</div>
                            <div className="text-[20px] tracking-[2px] text-center" style={{ textShadow: "2px 2px 5px black" }}>REWARD</div>
                            <div className="tracking-[-1px] my-3 text-center py-1 px-3">{presentData.title2}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[40%] flex justify-center items-center relative">
                <div className="w-[15%] flex justify-center items-center cursor-pointer}" onClick={onPrevious}>
                    <img src="assets/images/left_arrow.png" className={`${styles.arrow} w-[95px]`} alt="" draggable="false" />
                </div>
                <div className="w-[70%] flex justify-between">
                    {rewardList.map((item, index) => (
                        item.value === "" ?
                            <div
                                key={index}
                                className={`w-[180px] h-[200px] rounded-2xl flex flex-col justify-center items-center border-2 border-black cursor-pointer`}
                                style={{ boxShadow: "0 0 15px #FFA723" }}
                                onClick={() => setPresentData(item)}
                            >
                                <img src={item.getStatus === true ? item.image : `assets/images/weapon/${item.level === 4 ? randomVal[0] : randomVal[1]}.png`} className={item.available === true ? `w-full h-full rounded-2xl` : `brightness-75 w-full h-full rounded-2xl`} alt="" draggable="false" />
                                <div className={`${styles.numBtn} absolute top-[290px] z-10 w-[40px] h-[40px] flex justify-center items-center`}>{item.level}</div>
                                {item.getStatus === true ? <div className="absolute text-[20px]">CLAIMED</div> : null}
                            </div>
                            :
                            <div
                                key={index}
                                className="bg-[#091520] w-[180px] h-[200px] rounded-2xl flex flex-col justify-center items-center border-2 border-black cursor-pointer"
                                style={{ boxShadow: "0 0 15px #FFA723" }}
                                onClick={() => setPresentData(item)}
                            >
                                {
                                    item.level === 14 || item.level === 15 ?
                                        <img src={item.getStatus === true ? item.image : `assets/images/characters/avatar/${item.level === 14 ? randomVal[2] : randomVal[3]}.png`} className={item.available === true ? `w-[130px]` : `brightness-75 w-[130px]`} alt="" draggable="false" />
                                        :
                                        <img src={item.image} className={item.available === true ? `w-[130px]` : `brightness-75 w-[130px]`} alt="" draggable="false" />
                                }
                                <div className="mt-2">{item.value}</div>
                                <div className={`${styles.numBtn} absolute top-[290px] z-10 w-[40px] h-[40px] flex justify-center items-center`}>{item.level}</div>
                                {item.getStatus === true ? <div className="absolute text-[20px]">CLAIMED</div> : null}
                            </div>
                    ))}
                </div>
                <div className="w-[15%] flex justify-center items-center cursor-pointer" onClick={onNext}>
                    <img src="assets/images/right_arrow.png" className={`${styles.arrow} w-[95px]`} alt="" draggable="false" />
                </div>
                <div className="absolute top-[305px] h-[10px] w-screen bg-[#959595] z-0"></div>
            </div>
        </div>
    )
}