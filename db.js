const firebase = require('firebase');
// const bot =require('./index.js');
// const uniqid = require('uniqid');
// const bcrypt = require('bcrypt');

// console.log(bot);

var firebaseConfig = {
    apiKey: "AIzaSyCd0Z8q0WRMPbKIDgZOLOSTcGGP8PEvCMw",
    authDomain: "bot-vendas-b342c.firebaseapp.com",
    projectId: "bot-vendas-b342c",
    storageBucket: "bot-vendas-b342c.appspot.com",
    messagingSenderId: "814069309081",
    appId: "1:814069309081:web:eb34e7759adb759941a208"
};
firebase.default.initializeApp(firebaseConfig);

const FB = firebase.default.firestore();

const GetData = () => {
    const data = new Date();
    const dataText = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes()}`

    return dataText
}

// bot.bot.telegram.sendMessage("-4254384769", 'sd')

//========================================================
//                       USER
//========================================================

// bot.sendMessageGroup("oi")

const NewSell = async (obj, ctx) => {
    const data = new Date();
    const dataText = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes()}`

    var msg = ``

    if (obj.type.includes("ccfull")) msg = `<b> 💳 | CC FULL comprado!</b>

🏆Nível: ${obj.infos.nivel.toUpperCase()}
💰Preço: R$${obj.infos.price}
🏦Banco: ${obj.infos.nomBanco.toUpperCase()}

🤖 | @RycaStoreBot`
    if (obj.type.includes("ccconsultavel")) msg = `<b> 💳 | CC CONSULTAVEL comprado!</b> 

💵Limite: ${obj.infos.limit}
💰Preço: R$${obj.infos.price}
🏦Banco: ${obj.infos.banco.toUpperCase()}

🤖 | @RycaStoreBot`
    if (obj.type.includes("ccconsultada")) msg = `</b> 💳 | CC CONSULTADA comprado!</b> 

💵Limite: ${obj.infos.limit}
💰Preço: R$${obj.infos.price}
🏦Banco: ${obj.infos.nomBanco.toUpperCase()}

🤖 | @RycaStoreBot`
    if (obj.type.includes("gift")) msg = `<b> 💳 | GIFT CARD comprado!</b> 

💵Limite: ${obj.infos.value}
💰Preço: R$${obj.infos.price}
🏢Place: ${obj.infos.name.toUpperCase()}

🤖 | @RycaStoreBot`
    if (obj.type.includes("lara")) msg = `💳 | <b>${obj.type.toUpperCase()} PF comprado!</b>

💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
    if (obj.type.includes("login")) msg = `<b> 💳 | LOGIN comprado!</b> 

🏢Place: ${obj.type.replace("login ", "").toUpperCase()}
💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
    if (obj.type.includes("conta")) msg = `💳 | <b>${obj.type.toUpperCase()} comprado!</b> 

💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
    if (obj.type.includes("tela")) msg = `💳 | <b>${obj.type.toUpperCase()} comprado!</b> 

💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
if (obj.type.includes("link")) msg = `💳 | <b>${obj.type.toUpperCase()} comprado!</b> 

💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
if (obj.type.includes("hit")) msg = `💳 | <b>${obj.type.toUpperCase()} comprado!</b> 

💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
    if (obj.type.includes("nota")) msg = `💵 | <b>${obj.infos.quant}K NOTA FAKE comprado!</b>

✍🏻 Tipo: ${obj.type.replace("nota fake ", "")}
💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`
    if (obj.type.includes("editavel")) msg = `💵 | <b> EDITÁVEL comprado!</b> 

✍🏻 Tipo: ${obj.type.replace("editavel ", "")}
💰Preço: R$${obj.infos.price}

🤖 | @RycaStoreBot`

    const menu = {
        inline_keyboard: [
            [{
                text: "🛒 Comprar",
                url: "https://t.me/RycaStoreBot"
            }]
        ]
    }

    ctx.telegram.sendMessage("-1002017655217", msg, { reply_markup: menu, parse_mode: "HTML" })//1002070674482
    ctx.telegram.sendMessage("-1002070674482", msg, { reply_markup: menu, parse_mode: "HTML" })//1002070674482

    FB.collection("vendas").doc("historico").update({
        "his": firebase.default.firestore.FieldValue.arrayUnion({ data: dataText, ...obj })
    })
}

const CheckUser = async (infosUser) => {
    const user = (await FB.collection('users').where("id", "==", infosUser.id).get()).docs[0]

    if (user) {
        const data = await user.data()

        return data
    }
    else {
        try {  
            const newUser = await FB.collection("users").add({
                id: infosUser.id,
                money: 0,
                depositados: 0,
                gifts: 0,
                username: infosUser.username,
                ban: false,
                admin: false,
                buys: {
                    ccfull: [],
                    ccconsultada: [],
                    ccconsultavel: [],
                    gift: [],
                    lara: [],
                    logins: [],
                    contas: [],
                    notas: [],
                    editavel: [],
                },
                recargas: [],
                recargasGift: []
            })
            return ((await newUser.get()).data())
        } catch {
            return {error: true}
        }

    }
}

const GetAllUsers = async () => {
    const users = (await FB.collection("users").get()).docs.map(e => e.data())

    return users;
}
const GiftReward = async (code, id) => {
    const user = await CheckUser({ id: id })
    const gift = (await FB.collection("gift").where("code", "==", code).get()).docs[0]

    if (gift) {
        const giftInfos = await gift.data()
        if (giftInfos.status != "A") return { error: true, msg: "Gift já resgatado!" }

        const userSnap = (await FB.collection("users").where("id", "==", id).get()).docs[0]
        await FB.collection('users').doc(userSnap.id).update({
            money: +user.money + +giftInfos.value,
            gifts: +user.gifts + +giftInfos.value
        })
        await FB.collection("gift").doc(gift.id).update({ status: "U" })

        return {
            error: false, msg: `Gift Resgatado com sucesso!!!
Seu novo saldo é de: R$${+user.money + +giftInfos.value}`
        }
    } else {
        return { error: true, msg: "Gift Invalido!" }
    }
}


// GiftReward('3ed54o8e8lu7udo6c', 10).then(console.log)

//========================================================
//                       CC FULL
//========================================================




const GetCcInfosTypes = async () => {

    const infos = (await FB.collection("ccfull").get()).docs
    var count = {
        prepaid: 0,
        standard: 0,
        classic: 0,
        discover: 0,
        personal: 0,
        desconhecido: 0,
        corporate: 0,
        elo: 0,
        gold: 0,
        business: 0,
        hipercard: 0,
        platinum: 0,
        black: 0,
        infinite: 0,
        amex: 0,
    }
    await infos.forEach(i => {
        let info = i.data();

        count[info.nivel.toLowerCase()]++
    })

    return count;
}

const GetInfosByNivel = async (nivel) => {
    const snap = (await FB.collection("ccfull").get()).docs
    var infos = []

    await snap.forEach(i => {
        if (i.data().nivel.toLowerCase() == nivel) {
            infos.push(i.data())
        }
    })

    return infos
}

const BuyCcFull = async (num, userId, ctx) => {
    const doc = (await FB.collection("ccfull").where("num", "==", num).get()).docs[0]
    if(!doc) return { error: true }


    const infos = doc.data()
    const money = (await CheckUser({ id: userId })).money

    if (infos.price > money) return { error: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: money - infos.price,
        "buys.ccfull": firebase.default.firestore.FieldValue.arrayUnion({ ...infos, data: GetData() })
    })
    NewSell({ infos, type: "ccfull", user: userId }, ctx)


    FB.collection('ccfull').doc(doc.id).delete()

    return infos
}







//========================================================
//                       CC consultada
//========================================================

const GetCountInfo = async (type) => {
    const count = (await FB.collection(type).get()).docs.length

    return count
}

const GetCcConsultada = async (banco) => {

    var collection

    if (banco == 'nubank') collection = "ccconsultadanubank"
    if (banco == 'bb') collection = "ccconsultadabb"
    if (banco == 'caixa') collection = "ccconsultadacaixa"

    const snap = (await FB.collection(collection).get()).docs
    var infos = []

    await snap.forEach(i => {
        infos.push(i.data())
    })

    return infos
}


const BuyCcConsultada = async (banco, num, userId, ctx) => {

    var collection

    if (banco == 'nubank') collection = "ccconsultadanubank"
    if (banco == 'bb') collection = "ccconsultadabb"
    if (banco == 'caixa') collection = "ccconsultadacaixa"

    const doc = (await FB.collection(collection).where("num", "==", num).get()).docs[0]

    if(!doc) return { error: true }

    const infos = doc.data()
    const money = (await CheckUser({ id: userId })).money

    if (infos.price > money) return { error: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: money - infos.price,
        "buys.ccconsultada": firebase.default.firestore.FieldValue.arrayUnion({ ...infos, data: GetData() })
    })

    NewSell({ infos, type: "ccconsultada", user: userId }, ctx)


    FB.collection(collection).doc(doc.id).delete()

    return infos
}

//========================================================
//                       CC consultavel
//========================================================

const GetCcConsultavel = async (banco) => {

    var collection

    if (banco == 'atacadao') collection = "ccconsultavelatacadao"
    if (banco == 'itau') collection = "ccconsultavelitau"
    if (banco == 'santander') collection = "ccconsultavelsantander"
    if (banco == 'renner') collection = "ccconsultavelrenner"
    if (banco == 'bradesco') collection = "ccconsultavelbradesco"
    if (banco == 'carrefour') collection = "ccconsultavelcarrefour"

    const snap = (await FB.collection(collection).get()).docs
    var infos = []

    await snap.forEach(i => {
        infos.push(i.data())
    })

    return infos
}

const BuyCcConsultavel = async (banco, num, userId, ctx) => {

    var collection

    if (banco == 'atacadao') collection = "ccconsultavelatacadao"
    if (banco == 'itau') collection = "ccconsultavelitau"
    if (banco == 'santander') collection = "ccconsultavelsantander"
    if (banco == 'renner') collection = "ccconsultavelrenner"
    if (banco == 'bradesco') collection = "ccconsultavelbradesco"
    if (banco == 'carrefour') collection = "ccconsultavelcarrefour"

    const doc = (await FB.collection(collection).where("num", "==", num).get()).docs[0]
    if(!doc) return
    const infos = doc.data()
    const money = (await CheckUser({ id: userId })).money

    if (infos.price > money) return { error: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: money - infos.price,
        "buys.ccconsultavel": firebase.default.firestore.FieldValue.arrayUnion({ ...infos, data: GetData() })
    })

    NewSell({ infos, type: "ccconsultavel", user: userId }, ctx)

    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const GetCountGift = async (type) => {
    var collection = `gift${type}`

    let v100 = (await FB.collection(collection).where("value", "==", "100").get()).docs.length
    let v200 = (await FB.collection(collection).where("value", "==", "200").get()).docs.length

    return { v100, v200 }
}

const buyGiftCard = async (type, value, userId, ctx) => {
    var collection = `gift${type}`

    const doc = (await FB.collection(collection).where("value", '==', value).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (infos.price > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +infos.price,
        "buys.gift": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })

    NewSell({ infos, type: "gift", user: userId }, ctx)


    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const GetCountlara = async () => {
    const countMp = (await FB.collection("laramp").get()).docs.length
    const countRp = (await FB.collection("lararp").get()).docs.length
    const count99 = (await FB.collection("lara99").doc('estoque').get()).data().estoque

    return { countMp, countRp, count99 }
}

const GetLara = async (type) => {
    var collection = `lara${type}`

    const snap = (await FB.collection(collection).get()).docs
    var infos = []

    await snap.forEach(i => {
        infos.push(i.data())
    })

    return infos
}


const buyLara = async (type, cpf, userId, ctx) => {
    var collection = `lara${type}`

    const doc = (await FB.collection(collection).where("cpf", '==', cpf).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (infos.price > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +infos.price,
        "buys.lara": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })

    NewSell({ infos, type: `lara ${type}`, user: userId }, ctx)


    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const buyLara99 = async (type, cpf, userId, ctx) => {
    var collection = `lara99`

    const estoque = await (await FB.collection(collection).doc("estoque").get()).data().estoque

    if (estoque < 1) return { error: true }

    const money = (await CheckUser({ id: userId })).money

    if (50 > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - 50,
        "buys.lara": firebase.default.firestore.FieldValue.arrayUnion({ type: "99 pay", data: GetData() })
    })
    FB.collection("lara99").doc("estoque").update({
        estoque: estoque - 1
    })

    NewSell({ type: `lara99`, user: userId, price: 50, infos: { price: 50 } }, ctx)

    return { error: false }
}

const buyLogin = async (type, state, userId, ctx) => {
    var collection = `login${type}`

    const doc = (await FB.collection(collection).where("state", '==', state).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (20 > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - 20,
        "buys.logins": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })

    NewSell({ infos: { ...infos, price: 20 }, type: `login ${type}`, user: userId }, ctx)


    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const buyLogin15 = async (type, userId, ctx) => {
    var collection = `login${type}`

    const doc = (await FB.collection(collection).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (15 > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - 15,
        "buys.logins": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })
    NewSell({ infos: { ...infos, price: 15 }, type: `login ${type}`, user: userId }, ctx)

    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const buyHit = async (type, value, userId, ctx) => {
    var collection = `hit${type}`

    const doc = (await FB.collection(collection).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (+value > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +value,
        "buys.contas": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })
    NewSell({ infos: { ...infos, price: value }, type: `hit ${type}`, user: userId }, ctx)

    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const buyTela = async (type, value, userId, ctx) => {
    var collection = `tela${type}`

    const doc = (await FB.collection(collection).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (+value > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +value,
        "buys.contas": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })
    NewSell({ infos: { ...infos, price: value }, type: infos.link ? `link ${type}` : `tela ${type}`, user: userId }, ctx)

    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const buyConta = async (type, value, userId, ctx) => {
    var collection = `conta${type}`

    const doc = (await FB.collection(collection).get()).docs[0]

    if (!doc) return { error: true }

    const infos = doc.data()

    const money = (await CheckUser({ id: userId })).money

    if (+value > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +value,
        "buys.contas": firebase.default.firestore.FieldValue.arrayUnion({ type, ...infos, data: GetData() })
    })
    NewSell({ infos: { ...infos, price: value }, type: `conta ${type}`, user: userId }, ctx)

    FB.collection(collection).doc(doc.id).delete()

    return infos
}

const BuyNotaFake = async (type, value, quant, userId, ctx) => {
    const money = (await CheckUser({ id: userId })).money

    if (+value > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +value,
        "buys.notas": firebase.default.firestore.FieldValue.arrayUnion({ type, quant, value, data: GetData() })
    })
    NewSell({ infos: { quant, price: value }, type: `nota fake ${type}`, user: userId }, ctx)

    return { error: false }
}


const BuyEditavel = async (type, value, userId, ctx) => {
    const money = (await CheckUser({ id: userId })).money

    if (+value > money) return { nomoney: true }

    const snapIdUser = ((await FB.collection('users').where("id", "==", userId).get()).docs[0].id)

    FB.collection("users").doc(snapIdUser).update({
        money: +money - +value,
        "buys.editavel": firebase.default.firestore.FieldValue.arrayUnion({ type, value, data: GetData() })
    })
    NewSell({ infos: { price: value }, type: `editavel ${type}`, user: userId }, ctx)

    return { error: false }
}

const GetCountHit = async () => {
    const netflix = (await FB.collection(`hitnetflix`).get()).docs.length
    const max = (await FB.collection(`hitmax`).get()).docs.length
    const combo = (await FB.collection(`hitcombo`).get()).docs.length
    const disney = (await FB.collection(`hitdisney`).get()).docs.length
    const star = (await FB.collection(`hitstar`).get()).docs.length
    const crunchyroll = (await FB.collection(`hitcrunchyroll`).get()).docs.length
    const sky = (await FB.collection(`hitsky`).get()).docs.length
    const claro = (await FB.collection(`hitclaro`).get()).docs.length
    const play_plus = (await FB.collection(`hitplay_plus`).get()).docs.length
    const directgo = (await FB.collection(`hitdirectgo`).get()).docs.length
    const my_family_cinema = (await FB.collection(`hitmy_family_cinema`).get()).docs.length
    const tv_express = (await FB.collection(`hittv_express`).get()).docs.length
    const oi_plus = (await FB.collection(`hitoi_plus`).get()).docs.length
    const univer_video = (await FB.collection(`hituniver_video`).get()).docs.length
    const ufc_pass = (await FB.collection(`hitufc_pass`).get()).docs.length
    const tufos = (await FB.collection(`hittufos`).get()).docs.length

    return {
        netflix, max, combo, disney, star, crunchyroll, sky, claro, play_plus,
        directgo, my_family_cinema, tv_express, oi_plus, univer_video, ufc_pass, tufos
    }
}

const GetCountConta = async () => {
    const claro = (await FB.collection(`contaclaro_tv`).get()).docs.length
    const sky = (await FB.collection(`contasky`).get()).docs.length
    const crunchyroll = (await FB.collection(`contacrunchyroll`).get()).docs.length
    const deezes = (await FB.collection(`contadeezes`).get()).docs.length
    const discovery = (await FB.collection(`contadiscovery`).get()).docs.length
    const my_family_cinema = (await FB.collection(`contamy_family_cinema`).get()).docs.length

    return { claro, sky, crunchyroll, deezes, discovery, crunchyroll, my_family_cinema }
}

const GetCountTela = async () => {
    const netflix = (await FB.collection(`telanetflix`).get()).docs.length
    const prime_video = (await FB.collection(`telaprime_video`).get()).docs.length
    const combo = (await FB.collection(`telacombo`).get()).docs.length
    const star = (await FB.collection(`telastar`).get()).docs.length
    const disney = (await FB.collection(`teladisney`).get()).docs.length
    const max_paramount = (await FB.collection(`telamax_paramount`).get()).docs.length
    const globo_canais = (await FB.collection(`telaglobo_canais`).get()).docs.length
    const globo_completa = (await FB.collection(`telaglobo_completa`).get()).docs.length
    const premiere = (await FB.collection(`telapremiere`).get()).docs.length
    const spotify = (await FB.collection(`telaspotify`).get()).docs.length
    const youtube = (await FB.collection(`telayoutube`).get()).docs.length
    const canva = (await FB.collection(`telacanva`).get()).docs.length

    return { netflix, prime_video, combo, star, disney, max_paramount, globo_canais, globo_completa, premiere, spotify, youtube, canva }
}


const GetCountLogin = async (type) => {
    const SP = (await FB.collection(`login${type}`).where("state", "==", "SP").get()).docs.length
    const RJ = (await FB.collection(`login${type}`).where("state", "==", "RJ").get()).docs.length
    const BA = (await FB.collection(`login${type}`).where("state", "==", "BA").get()).docs.length
    const MG = (await FB.collection(`login${type}`).where("state", "==", "MG").get()).docs.length
    const AC = (await FB.collection(`login${type}`).where("state", "==", "AC").get()).docs.length
    const AP = (await FB.collection(`login${type}`).where("state", "==", "AP").get()).docs.length
    const CE = (await FB.collection(`login${type}`).where("state", "==", "CE").get()).docs.length
    const DF = (await FB.collection(`login${type}`).where("state", "==", "DF").get()).docs.length
    const ES = (await FB.collection(`login${type}`).where("state", "==", "ES").get()).docs.length
    const GO = (await FB.collection(`login${type}`).where("state", "==", "GO").get()).docs.length
    const MA = (await FB.collection(`login${type}`).where("state", "==", "MA").get()).docs.length
    const MT = (await FB.collection(`login${type}`).where("state", "==", "MT").get()).docs.length
    const MS = (await FB.collection(`login${type}`).where("state", "==", "MS").get()).docs.length
    const PA = (await FB.collection(`login${type}`).where("state", "==", "PA").get()).docs.length
    const PR = (await FB.collection(`login${type}`).where("state", "==", "PR").get()).docs.length
    const PE = (await FB.collection(`login${type}`).where("state", "==", "PE").get()).docs.length
    const PI = (await FB.collection(`login${type}`).where("state", "==", "PI").get()).docs.length
    const RR = (await FB.collection(`login${type}`).where("state", "==", "RR").get()).docs.length
    const RN = (await FB.collection(`login${type}`).where("state", "==", "RN").get()).docs.length
    const SC = (await FB.collection(`login${type}`).where("state", "==", "SC").get()).docs.length
    const SE = (await FB.collection(`login${type}`).where("state", "==", "SE").get()).docs.length
    const TO = (await FB.collection(`login${type}`).where("state", "==", "TO").get()).docs.length
    const PB = (await FB.collection(`login${type}`).where("state", "==", "PB").get()).docs.length
    const RO = (await FB.collection(`login${type}`).where("state", "==", "RO").get()).docs.length
    const RS = (await FB.collection(`login${type}`).where("state", "==", "RS").get()).docs.length
    const AM = (await FB.collection(`login${type}`).where("state", "==", "AM").get()).docs.length
    const AL = (await FB.collection(`login${type}`).where("state", "==", "AL").get()).docs.length
    const all = (await FB.collection(`login${type}`).get()).docs.length

    return {
        SP, RJ, BA, MG, AC, AP, CE, DF, ES, GO, MA, MT, MS, PA, PR, PE,
        PI, RR, RN, SC, SE, TO, PB, RO, RS, AM, AL, all
    }
}

const GetCountLogin15 = async (type) => {
    const all = (await FB.collection(`login${type}`).get()).docs.length

    return { all }
}

const AddNewCob = async (idUser, cobInfos) => {
    const idDocUser = (await FB.collection("users").where("id", "==", idUser).get()).docs[0]
    if (!idDocUser) return { error: true, msg: "Usuario não encontrado" }

    const data = new Date();
    const dataText = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes()}`


    const obj = {
        idUser,
        ...cobInfos,
        data: dataText
    }

    await FB.collection("depositos").add(obj)
    await FB.collection("users").doc(idDocUser.id).update({
        "depositos": firebase.default.firestore.FieldValue.arrayUnion(obj)
    })
    await FB.collection("depositos").doc("historico").update({
        "depositos": firebase.default.firestore.FieldValue.arrayUnion(obj)
    })
}

const DepositoConfirmado = async (idUser, idCob) => {
    const idDocUser = (await FB.collection("users").where("id", "==", idUser).get()).docs[0]
    const idDocCob = (await FB.collection("depositos").where("idCob", "==", idCob).get()).docs[0]

    const hisCobsArray = (await FB.collection("depositos").doc('historico').get()).data().depositos
    const hisCobsWithoutCob = hisCobsArray.filter(i => i.idCob != idCob)
    const cobInfos = hisCobsArray.filter(i => i.idCob == idCob)[0]

    await FB.collection("depositos").doc("historico").update({
        'depositos': [...hisCobsWithoutCob, { ...cobInfos, status: "approved" }]
    })
    await FB.collection("depositos").doc(idDocCob.id).update({
        status: "approved"
    })
    await FB.collection('users').doc(idDocUser.id).update({
        money: (idDocUser.data().money) += +idDocCob.data().value,
        depositados: (idDocUser.data().depositados) += +idDocCob.data().value,
    })

    if (!idDocUser) return { error: true, msg: "Usuario não encontrado" }
}

const DepositoExpirado = async (idCob) => {
    const idDocCob = (await FB.collection("depositos").where("idCob", "==", idCob).get()).docs[0]

    if (idDocCob.data().status == "approved") return {ispay: true}

    const hisCobsArray = (await FB.collection("depositos").doc('historico').get()).data().depositos
    const hisCobsWithoutCob = hisCobsArray.filter(i => i.idCob != idCob)
    const cobInfos = hisCobsArray.filter(i => i.idCob == idCob)[0]

    await FB.collection("depositos").doc("historico").update({
        'depositos': [...hisCobsWithoutCob, { ...cobInfos, status: "expired" }]
    })
    await FB.collection("depositos").doc(idDocCob.id).update({
        status: "expired"
    })

    return {ispay: false}
}


// AddNewCob(10)

module.exports = {
    CheckUser,
    GetCcInfosTypes,
    GetInfosByNivel,
    BuyCcFull, //
    GiftReward,
    GetCountInfo,
    GetCcConsultada,
    GetCcConsultavel,
    BuyCcConsultada,
    BuyCcConsultavel,
    GetCountGift,
    buyGiftCard,
    GetCountlara,
    GetLara,
    buyLara,
    GetCountLogin,
    buyLogin,
    GetCountLogin15,
    buyLogin15,
    buyHit,
    GetCountHit,
    GetCountConta,
    buyConta,
    BuyNotaFake,
    BuyEditavel,
    GetAllUsers,
    AddNewCob,
    DepositoConfirmado,
    GetCountTela,
    buyTela,
    buyLara99,
    DepositoExpirado
}