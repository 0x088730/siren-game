import axios from "axios";
import { global } from './global'
import config from '../utils/config'
import store from "../store";
import { setRememberCode } from "./state/game/reducer";

// axios.defaults.baseURL = `${config.server}:${config.port}${config.baseURL}`
axios.defaults.baseURL = `${config.server}${config.baseURL}`
export const getProfile = async (walletAddress: string, character: string) => {
    const data = (await axios.post('/user/profile', {
        walletAddress,
        character
    })).data
    const user = data.user
    let currentCharacter = user.characters.filter((character: any) => character.characterName === global.currentCharacterName)[0]
    global.hp = currentCharacter.hp
    global.damage = currentCharacter.damage
    global.critical = currentCharacter.critical
    global.purchase = data.purchase
    global.embed = data.embed
    global.exp = currentCharacter.exp
    global.rarity = currentCharacter.rarity
    global.room = user.room
    global.userRef = user.userRef
    global.wall = user.wall
    global.energy = currentCharacter.energy
    global.characters = user.characters
    global.currentCharacterName = currentCharacter.characterName
    global.level = user.level
    global.hunterLevel = user.hunterLevel
    global.sectionStatus = data.sectionStatus
    global.resource = user.resource
    global.water = user.water
    global.referralCode = user.userRef
    global.referralCodeStatua = user.enterCodeStatus
    global.weapons = user.weapons
    store.dispatch(setRememberCode(user.enterCodeStatus));
    global.skull = user.skull
}
export const referalAdd = async () => {
    await axios.post('/user/referal', {
        guest: global.userRef,
        introducer: global.ref,
    })
}
export const getRoom = async () => {
    const rooms = await (await axios.post('/user/room', {})).data.room
    global.rooms = rooms
}
export const setCurrentCharacter = async (character: string) => {
    await (await axios.post('/user/current-character', { walletAddress: global.walletAddress, character: character })).data.room
}
export const itemModify = async (walletAddress: string, character: string, item: string, amount: number, currentChaper: number, currentSection: number, selectChapter: number, selectSection: number, win: string, cb: Function) => {

    const data = (await axios.post('/user/item', {
        walletAddress,
        character,
        item,
        amount,
        currentChaper,
        currentSection,
        selectChapter,
        selectSection,
        win,
    })).data;
    const user = data.user
    let currentCharacter = user.characters.filter((character: any) => character.characterName === user.currentCharacterName)[0]
    global.room = user.room
    cb({
        characters: currentCharacter,
        purchase: data.purchase,
        embed: data.embed,
        room: user.room,
        currentCharacterName: character
    });
}

export const itemRevive = async (walletAddress: string, character: string, item: string, cb: Function) => {
    const data = (await axios.post('/user/item/revive', {
        walletAddress,
        character,
        item
    })).data;

    const user = data.user

    let currentCharacter = user.characters.filter((character: any) => character.characterName === user.currentCharacterName)[0]
    cb({
        characters: currentCharacter,
        purchase: data.purchase,
        embed: data.embed,
        room: user.room,
        currentCharacterName: character

    });
}

export const energySwap = async (walletAddress: string, character: string, amount: Number, cb: Function) => {
    const data = (await axios.post('/user/swap/energy', {
        walletAddress,
        character,
        amount
    })).data;

    // const user = data.user
    let currentCharacter = data.characters.filter((character: any) => character.characterName === data.currentCharacterName)[0]

    cb({
        energy: currentCharacter.energy,
        water: data.water,
    });
}