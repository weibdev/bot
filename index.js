const { Telegraf } = require('telegraf')
const Db = require("./db")
const { inlineKeyboard } = require('telegraf/markup')
const PIX = require("./pix")

const bot = new Telegraf("6446317284:AAF3ch1-WAfXk66Qzgh-mYd4cyP_Hbi8wRc")

// bot.telegram.getChatMember('-4254384769', '5406567086').then(console.log)


const DeleteMSG = (ctx) => {
    try {
        ctx.deleteMessage()
    } catch (e) { }

}

async function sendMessageImg(msg, img) {
    await bot.telegram.sendPhoto("6141024093", img)
    bot.telegram.sendMessage("6141024093", msg)
}


bot.command("teste", ctx => {
    ctx.reply("<b>oi</b>", {parse_mode:"HTML"})
})


bot.command("anunciarImg", async (ctx) => {
    const user = await Db.CheckUser({ id: ctx.chat.id })

    if (!user.admin) return ctx.reply("Você não pode usar esse comando!")

    const img = ctx.args[0]
    var msg = ""

    await ctx.args.splice(1).forEach(e => msg += `${e} `.replaceAll("<br>", "\n"))

    const users = await Db.GetAllUsers();

    users.forEach(async e => {
        try {
            await bot.telegram.sendPhoto(e.id, img, { caption: msg })

        } catch {
            console.log('fail');
        }
    })
})

bot.command("anunciar", async (ctx) => {

    const user = await Db.CheckUser({ id: ctx.chat.id })

    if (!user.admin) return ctx.reply("Você não pode usar esse comando!")


    var msg = ""

    await ctx.args.forEach(e => msg += `${e} `.replaceAll("<br>", "\n"))

    const users = await Db.GetAllUsers();

    users.forEach(e => {
        try {
            bot.telegram.sendMessage(e.id, msg)
        } catch {
            console.log('fail');
        }
    })



})



//#region Start

bot.command('start', async (ctx) => {

    // console.log(await bot.telegram.getChatMember("-4254384769", ctx.chat.id));

    if ((await bot.telegram.getChatMember("-1002017655217", ctx.chat.id)).status == "left") {
        const msg = `𝗣𝗮𝗿𝗮 𝗮𝗰𝗲𝘀𝘀𝗮𝗿 𝗲𝘀𝘀𝗲 𝗯𝗼𝘁 𝗲 𝗼𝗯𝗿𝗶𝗴𝗮𝘁𝗼𝗿𝗶𝗼 𝗾𝘂𝗲 𝘀𝗲 𝗶𝗻𝘀𝗰𝗿𝗲𝘃𝗮 𝗻𝗼 𝗰𝗮𝗻𝗮𝗹 𝗮𝗯𝗮𝗶𝘅𝗼!

𝗜𝗻𝘀𝗰𝗿𝗲𝘃𝗮-𝘀𝗲 𝗮𝗴𝗼𝗿𝗮 𝗰𝗹𝗶𝗰𝗮𝗻𝗱𝗼 𝗮𝗯𝗮𝗶𝘅𝗼 𝗽𝗮𝗿𝗮 𝗽𝗼𝗱𝗲𝗿 𝗰𝗼𝗺𝗲𝗰𝗮𝗿 𝗮 𝘂𝘀𝗮𝗿 𝗼 𝗯𝗼𝘁:
`
        const menu = {
            inline_keyboard: [
                [{ text: "🔗 𝗦𝗲 𝗶𝗻𝘀𝗰𝗿𝗲𝘃𝗲𝗿 𝗻𝗼 𝗖𝗮𝗻𝗮𝗹", url: "https://t.me/rycastore" }]
            ]
        }

        return ctx.reply(msg, { reply_markup: menu })

    }


    const user = await Db.CheckUser(ctx.message.chat)

    if(user.error) return 

    const msg = `💟 𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼 𝗮 𝗥𝘆𝗰𝗮 𝗦𝘁𝗼𝗿𝗲 
🏆 𝗔 𝘀𝘁𝗼𝗿𝗲 𝟬𝟭 𝗱𝗼 𝘁𝗲𝗹𝗲𝗴𝗿𝗮𝗺.

❗Caso não tenha o material desejado contate o nosso suporte ☺

ℹ Antes do uso confira os termos/regras

🛍 Boa compra!

🗣 Grupo: @RycaStoreGroup
👥 Comunidade: @RycaStore

🧾 Seu perfil:
├👤 Username: @${ctx.message.chat.username}
├👤 Id: ${ctx.message.chat.id}
└💸 Saldo: R$${user.money.toFixed(2)}`

    const menu = {
        inline_keyboard: [
            [
                {
                    text: "👤 𝗠𝗶𝗻𝗵𝗮 𝗰𝗼𝗻𝘁𝗮",
                    callback_data: "/minhaconta" //🛒📌👤
                }
            ],
            [
                {
                    text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ",
                    callback_data: "/buy"
                },
                {
                    text: "💰 𝗔𝗱𝗶𝗰𝗶𝗼𝗻𝗮𝗿 𝗦𝗮𝗹𝗱𝗼",
                    callback_data: "/addmoney"
                }
            ],
            [
                {
                    text: "📖 𝗧𝗲𝗿𝗺𝗼𝘀 𝗱𝗲 𝘁𝗿𝗼𝗰𝗮𝘀",
                    callback_data: "/termos"
                }
            ],
            [
                {
                    text: "📌 𝗦𝘂𝗽𝗼𝗿𝘁𝗲",
                    url: "https://t.me/SuporteRycaStore"
                }
            ],
        ]
    }



    ctx.reply(msg, { reply_markup: menu })
})

bot.action('/start', async (ctx) => {
    DeleteMSG(ctx)

    const user = await Db.CheckUser(ctx.chat)

    const msg = `💟 𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼 𝗮 𝗥𝘆𝗰𝗮 𝗦𝘁𝗼𝗿𝗲 
    🏆 𝗔 𝘀𝘁𝗼𝗿𝗲 𝟬𝟭 𝗱𝗼 𝘁𝗲𝗹𝗲𝗴𝗿𝗮𝗺.
    
    ❗Caso não tenha o material desejado contate o nosso suporte ☺
    
    ℹ Antes do uso confira os termos/regras
    
    🛍 Boa compra!
    
    🗣 Grupo: @RycaStoreGroup
    👥 Comunidade: @RycaStore

🧾 Seu perfil:
├👤 Username: @${ctx.chat.username}
├👤 Id: ${ctx.chat.id}
└💸 Saldo: R$${user.money.toFixed(2)}`

    const menu = {
        inline_keyboard: [
            [
                {
                    text: "👤 𝗠𝗶𝗻𝗵𝗮 𝗰𝗼𝗻𝘁𝗮",
                    callback_data: "/minhaconta" //🛒📌👤
                }
            ],
            [
                {
                    text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ",
                    callback_data: "/buy"
                },
                {
                    text: "💰  𝗔𝗱𝗶𝗰𝗶𝗼𝗻𝗮𝗿 𝗦𝗮𝗹𝗱𝗼",
                    callback_data: "/addmoney"
                }
            ],
            [
                {
                    text: "📖 𝗧𝗲𝗿𝗺𝗼𝘀 𝗱𝗲 𝘁𝗿𝗼𝗰𝗮𝘀",
                    callback_data: "/termos"
                }
            ],
            [
                {
                    text: "📌 𝗦𝘂𝗽𝗼𝗿𝘁𝗲",
                    url: "https://t.me/SuporteRycaStore"
                }
            ],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})


//#endregion

//===================================================================================
//                  ADD MONEY
//===================================================================================

//#region  Pix

bot.action("/addmoney", async ctx => {
    DeleteMSG(ctx)


    const msg = `Escolha uma das opções a seguir:`
    const menu = {
        inline_keyboard: [
            [
                { text: "𝗣𝗶𝘅 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰𝗼", callback_data: "/pixautomatico" }
            ],
            [
                { text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }
            ]
        ]
    }
    ctx.reply(msg, { reply_markup: menu })
})

bot.action("/pixautomatico", async ctx => {
    DeleteMSG(ctx)

    const msg = `Para adicionar saldo à sua conta, siga as instruções abaixo:

1. Utilize o comando /pix seguido do valor desejado. Por exemplo:
   - /pix 15 - Cria um pagamento para adicionar R$15 de saldo à sua conta.
   - /pix 25 - Cria um pagamento para adicionar R$25 de saldo à sua conta.

2. Após enviar o comando, será gerado um código Pix que você deverá copiar e colar.

3. Abra o aplicativo do seu banco de preferência e navegue até a sessão "Pix > Copiar e Colar".

4. Cole o código Pix gerado anteriormente e efetue o pagamento utilizando o aplicativo do seu banco.

5. Após realizar o pagamento, retorne ao bot e clique no botão "Confirmar Pagamento".

Pronto! O saldo correspondente ao valor do pagamento será adicionado à sua conta. Certifique-se de efetuar o pagamento dentro do prazo estipulado para evitar problemas na confirmação.`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }]
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})

bot.command("pix", async ctx => {
    const value = +ctx.args[0]

    if (value < 10) return ctx.reply("O valor de deposito minimo é de R$10")
    if (value >= 10) {
        console.log('oi');
        const infosCob = await PIX.newCob(value)
        await Db.AddNewCob(ctx.chat.id, infosCob)

        const msg = `✅ | Sua transação foi criada!

💵 | Valor do Pix Solicitado:  R$ ${value}
⏰ | Prazo de Pagamento 5 minutos
⚠️ | Está com problemas no pagamento? Tente pagar de outro banco!

💠 | Pix Copia e Cola:
${"`"}${infosCob.codPix}${"`"}

🥇 | Se não Conseguir Fazer Pix Automatico, Chame o @SuporteRycaStore ✅`


        const message = await bot.telegram.sendMessage(ctx.chat.id, msg, { parse_mode: "Markdown" })

        const checker = setInterval(async () => {
            const res = await PIX.checkCob(infosCob.idCob)
            if (res.status == "approved") {
                ctx.deleteMessage(message.message_id)
                await Db.DepositoConfirmado(ctx.chat.id, infosCob.idCob)

                const msgC = `✨𝗔𝗴𝗼𝗿𝗮 𝘀𝗶𝗺  𝗼 𝗽𝗮𝗴𝗮𝗺𝗲𝗻𝘁𝗼 𝗳𝗼𝗶 𝗰𝗼𝗻𝗰𝗹𝘂𝗶𝗱𝗼 𝗲 𝗥$ ${infosCob.value.toFixed(1)} 𝗳𝗼𝗶 𝗮𝗱𝗶𝗰𝗶𝗼𝗻𝗮𝗱𝗼 𝗲𝗺 𝘀𝘂𝗮 𝗰𝗼𝗻𝘁𝗮 𝗻𝗼 𝗯𝗼𝘁.`
                //https://ibb.co/Gsq13CJ
                const menuC = {
                    inline_keyboard: [
                        [{ text: "𝗠𝗲𝗻𝘂", callback_data: "/start" }]
                    ]
                }

                ctx.sendPhoto("https://ibb.co/Gsq13CJ", { caption: msgC, reply_markup: menuC })
                clearInterval(checker)
            }
            if (res.status == 'expired') {
                clearInterval(checker)
            }
        }, 5000)
        setTimeout(async () => {
            try {
                clearInterval(checker)

                const ispay = await Db.DepositoExpirado(infosCob.idCob)

                if(!ispay.ispay) {
                    ctx.deleteMessage(message.message_id)
                }
            } catch {

            }
        }, 300000)


    }
    else return ctx.reply(`Para adicionar saldo à sua conta, siga as instruções abaixo:

1. Utilize o comando /pix seguido do valor desejado. Por exemplo:
   - /pix 15 - Cria um pagamento para adicionar R$15 de saldo à sua conta.
   - /pix 25 - Cria um pagamento para adicionar R$25 de saldo à sua conta.

2. Após enviar o comando, será gerado um código Pix que você deverá copiar e colar.

3. Abra o aplicativo do seu banco de preferência e navegue até a sessão "Pix > Copiar e Colar".

4. Cole o código Pix gerado anteriormente e efetue o pagamento utilizando o aplicativo do seu banco.

5. Após realizar o pagamento, retorne ao bot e clique no botão "Confirmar Pagamento".

Pronto! O saldo correspondente ao valor do pagamento será adicionado à sua conta. Certifique-se de efetuar o pagamento dentro do prazo estipulado para evitar problemas na confirmação.`)

})

//#endregion






//===================================================================================
//                  MINHA CONTA
//===================================================================================
//#region Minha conta

bot.action('/minhaconta', async ctx => {
    DeleteMSG(ctx)


    const user = await Db.CheckUser(ctx.chat)

    const msg = `
✨Suas Informações
- Aqui você pode visualizar os detalhes da sua conta.

- 🧑 Usuario:
📛 Nome: ${ctx.chat.username}
💓 User: @${ctx.chat.username}
👮‍♀️ Admin: ${user.admin ? "Sim" : "Não"}
🚫 Banido: ${user.ban ? "Sim" : "Não"}


- 💰 Carteira:
🆔 ID da carteira: 6929169125
💸 Saldo: R$${user.money.toFixed(2)}


- 🛒 Compras:
💳 Cartões comprados: ${user.buys.ccfull.length}
💳 Consultadas compradas: ${user.buys.ccconsultada.length}
💳 Consultaveis compradas: ${user.buys.ccconsultavel.length}
🛒 Logins comprados: ${user.buys.logins.length}
🛒 GiftCards comprados: ${user.buys.gift.length}
🛒 Laras comprados: ${user.buys.lara.length}
🛒 Contas Premiun comprados: ${user.buys.contas.length}
🛒 Notas Fakes: ${user.buys.notas.length}
🛒 Editavel: ${user.buys.editavel.length}
💠 Pix inseridos: R$${user.depositados}
🎁 Gifts resgatados: R$${user.gifts}
    `
    const menu = {
        inline_keyboard: [
            [{ text: "🔁 𝗛𝗶𝘀𝘁ó𝗿𝗶𝗰𝗼 𝗱𝗲 𝗰𝗼𝗺𝗽𝗿𝗮𝘀", callback_data: '/historico' }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],


        ]
    }

    ctx.reply(msg, { reply_markup: menu })

})






//#endregion


//#region  Historico de compras 

bot.action("/historico", async (ctx) => {
    DeleteMSG(ctx)

    const user = await Db.CheckUser(ctx.chat)
    const msg = `<b>Histótico de compras:</b>`
    const menu = {
        inline_keyboard: [
            [{ text: `𝗜𝗡𝗙𝗢𝗦 𝗖𝗖 - ${user.buys.ccfull.length}`, callback_data: `/hisbuy ccfull 0` }],
            [{ text: `𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝗱𝗮 - ${user.buys.ccconsultada.length}`, callback_data: `/hisbuy ccconsultada 0` }],
            [{ text: `𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝘃𝗲𝗶𝘀 - ${user.buys.ccconsultavel.length}`, callback_data: `/hisbuy ccconsultavel 0` }],
            [{ text: `𝗚𝗜𝗙𝗧 𝗖𝗔𝗥𝗗 - ${user.buys.gift.length}`, callback_data: `/hisbuy gift 0` }],
            [{ text: `𝗟𝗔𝗥𝗔𝗦 - ${user.buys.lara.length}`, callback_data: `/hisbuy lara 0` }],
            [{ text: `𝗟𝗢𝗚𝗜𝗡𝗦 - ${user.buys.logins.length}`, callback_data: `/hisbuy logins 0` }],
            [{ text: `𝗦𝗧𝗥𝗘𝗔𝗠𝗜𝗡𝗚 - ${user.buys.contas.length}`, callback_data: `/hisbuy contas 0` }], //𝗘𝗗𝗜𝗧𝗔𝗩𝗘𝗜𝗦
            [{ text: `𝗘𝗗𝗜𝗧𝗔𝗩𝗘𝗜𝗦 - ${user.buys.editavel.length}`, callback_data: `/hisbuy editavel 0` }], //𝗘𝗗𝗜𝗧𝗔𝗩𝗘𝗜𝗦
            [{ text: `𝗡𝗢𝗧𝗔𝗦 - ${user.buys.notas.length}`, callback_data: `/hisbuy notas 0` }], //𝗘𝗗𝗜𝗧𝗔𝗩𝗘𝗜𝗦
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/minhaconta' }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu, parse_mode: "HTML" })
})


//#endregion

//#endregion 



//===================================================================================
//                  BUY
//===================================================================================

//#region Buy

bot.action("/buy", async ctx => {
    DeleteMSG(ctx)


    const msg = `<b>COMPRAR:</b>`

    const menu = {
        inline_keyboard: [
            [{ text: "💳 𝗖𝗖 𝗙𝘂𝗹𝗹", callback_data: "/buyinfocc" }],
            [{ text: "💳 𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝗱𝗮", callback_data: "/buyccconsultada" }],
            [{ text: "💳 𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝘃𝗲𝗹 ", callback_data: "/buyccconsultavel" }],
            [{ text: "🎫 𝗚𝗶𝗳𝘁 𝗖𝗮𝗿𝗱", callback_data: "/buygiftcard" }],
            [{ text: "🏦 𝗟𝗮𝗿𝗮", callback_data: "/buylara" }],
            [{ text: "💵 𝗡𝗼𝘁𝗮 𝗙𝗮𝗸𝗲", callback_data: "/buynotas" }],
            [{ text: "🪪 𝗘𝗱𝗶𝘁𝗮𝘃𝗲𝗹", callback_data: "/buyeditavel" }],
            [{ text: "🔐 𝗟𝗼𝗴𝗶𝗻", callback_data: "/buylogin" }],
            [{ text: "🎉 𝗦𝘁𝗿𝗲𝗮𝗺𝗶𝗻𝗴", callback_data: "/buyconta" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }], //🪪 𝗘𝗱𝗶𝘁𝗮𝘃𝗲𝗹

        ]
    }

    ctx.reply(msg, { reply_markup: menu, parse_mode: "HTML" })
})



//#region InfoCC

bot.action("/buyinfocc", async ctx => {

    const msg = "CCs com os dados reais dos donos"
    const menu = {
        inline_keyboard: [
            [{ text: "𝗙𝘂𝗹𝗹 𝗨𝗻𝗶𝘁á𝗿𝗶𝗮 💳", callback_data: "/ccfullunit" }],
            // [
            //     { text: "🏦 Pesquisar banco", callback_data: "/ccfullbanco" },
            //     { text: "🔐 Pesquisar bin", callback_data: "/ccfullbin" }
            // ],
            // [
            //     { text: "🏳️ Pesquisa bandeira", callback_data: "/ccfullband" },
            //     { text: "🔰 Pesquisar level", callback_data: "/ccfulllevel" }
            // ],
            // [{ text: "🌎 Pesquisar país", callback_data: "/ccfullpais" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })
    DeleteMSG(ctx)


})

bot.action("/ccfullunit", async ctx => {

    DeleteMSG(ctx)


    const user = await Db.CheckUser(ctx.chat)
    const count = await Db.GetCcInfosTypes()
    const msg = `
💳 Comprar CCs Unitárias Full

⥬ Saldo R$${user.money.toFixed(2)}
    `
    const menu = {
        inline_keyboard: [
            [
                { text: `$22 𝗣𝗥𝗘𝗣𝗔𝗜𝗗 | ${count.prepaid}`, callback_data: "/buyinfoccbytype prepaid" },
                { text: `$25 𝗦𝗧𝗔𝗡𝗗𝗔𝗥𝗗 | ${count.standard}`, callback_data: "/buyinfoccbytype standard" },
            ],
            [
                { text: `$25 𝗖𝗟𝗔𝗦𝗦𝗜𝗖 | ${count.classic}`, callback_data: "/buyinfoccbytype classic" },
                { text: `$25 𝗗𝗜𝗦𝗖𝗢𝗩𝗘𝗥 | ${count.discover}`, callback_data: "/buyinfoccbytype discover" },
            ],
            [
                { text: `$25 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟 | ${count.personal}`, callback_data: "/buyinfoccbytype personal" },
                { text: `$30 𝗗𝗘𝗦𝗖𝗢𝗡𝗛𝗘𝗖𝗜𝗗𝗢 | ${count.desconhecido}`, callback_data: "/buyinfoccbytype desconhecido " },
            ],
            [
                { text: `$30 𝗖𝗢𝗥𝗣𝗢𝗥𝗔𝗧𝗘 | ${count.corporate}`, callback_data: "/buyinfoccbytype corporate" },
                { text: `$35 𝗘𝗟𝗢 | ${count.elo}`, callback_data: "/buyinfoccbytype elo" },
            ],
            [
                { text: `$35 𝗚𝗢𝗟𝗗 | ${count.gold}`, callback_data: "/buyinfoccbytype gold" },
                { text: `$45 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 | ${count.business}`, callback_data: "/buyinfoccbytype business" },
            ],
            [
                { text: `$45 𝗛𝗜𝗣𝗘𝗥𝗖𝗔𝗥𝗗 | ${count.hipercard}`, callback_data: "/buyinfoccbytype hipercard" },
                { text: `$50 𝗣𝗟𝗔𝗧𝗜𝗡𝗨𝗠 | ${count.platinum}`, callback_data: "/buyinfoccbytype platinum" },
            ],
            [
                { text: `$80 𝗕𝗟𝗔𝗖𝗞 | ${count.black}`, callback_data: "/buyinfoccbytype black" },
                { text: `$80 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗘 | ${count.infinite}`, callback_data: "/buyinfoccbytype infinite" },
            ],
            [
                { text: `$100 𝗔𝗠𝗘𝗫 | ${count.gold}`, callback_data: "/buyinfoccbytype amex" },
            ],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyinfocc" }]
        ]
    }
    ctx.reply(msg, { reply_markup: menu })
})

//#endregion






//#region CC Consultada

bot.action("/buyccconsultada", async ctx => {
    DeleteMSG(ctx)


    const countNubank = await Db.GetCountInfo("ccconsultadanubank")
    const countBancobrasil = await Db.GetCountInfo("ccconsultadabb")
    const countCaixa = await Db.GetCountInfo("ccconsultadacaixa")


    const msg = "CCs com os dados reais dos donos"
    const menu = {
        inline_keyboard: [
            [{ text: `𝗡𝘂𝗯𝗮𝗻𝗸 | ${countNubank}`, callback_data: "/buyccconsultadabybanco nubank" }],
            [{ text: `𝗕𝗮𝗻𝗰𝗼 𝗱𝗼 𝗕𝗿𝗮𝘀𝗶𝗹 | ${countBancobrasil}`, callback_data: "/buyccconsultadabybanco bb" }],
            [{ text: `𝗖𝗮𝗶𝘅𝗮 | ${countCaixa}`, callback_data: "/buyccconsultadabybanco caixa" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })
})

//#endregion





//#region CC Consultavel 

bot.action("/buyccconsultavel", async ctx => {

    const countAtacadao = await Db.GetCountInfo("ccconsultavelatacadao")
    const countBradesco = await Db.GetCountInfo("ccconsultavelbradesco")
    const countCarrefour = await Db.GetCountInfo("ccconsultavelcarrefour")
    const countItau = await Db.GetCountInfo("ccconsultavelitau")
    const countRenner = await Db.GetCountInfo("ccconsultavelrenner")
    const countSantander = await Db.GetCountInfo("ccconsultavelsantander")


    const msg = "CCs com os dados reais dos donos"
    const menu = {
        inline_keyboard: [
            [
                { text: `𝗔𝘁𝗮𝗰𝗮𝗱ã𝗼 | ${countAtacadao}`, callback_data: "/buyccconsultavelbybanco atacadao" },
                { text: `𝗕𝗿𝗮𝗱𝗲𝘀𝗰𝗼 | ${countBradesco}`, callback_data: "/buyccconsultavelbybanco bradesco" }
            ],
            [
                { text: `𝐂𝐚𝐫𝐫𝐞𝐟𝐨𝐮𝐫 | ${countCarrefour}`, callback_data: "/buyccconsultavelbybanco carrefour" },
                { text: `𝗜𝘁𝗮𝘂 | ${countItau}`, callback_data: "/buyccconsultavelbybanco itau" }
            ],
            [
                { text: `𝗥𝗲𝗻𝗻𝗲𝗿 | ${countRenner}`, callback_data: "/buyccconsultavelbybanco renner" },
                { text: `𝗦𝗮𝗻𝘁𝗮𝗻𝗱𝗲𝗿 | ${countSantander}`, callback_data: "/buyccconsultavelbybanco santander" }
            ],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })
    DeleteMSG(ctx)

})


//#endregion




//#region Gift Cards

bot.action("/buygiftcard", async ctx => {

    const msg = "Gift Cards 50% OFF"
    const menu = {
        inline_keyboard: [
            [{ text: "𝗜𝗙𝗢𝗢𝗗", callback_data: "/giftifood" }],
            [{ text: "𝗚𝗢𝗢𝗚𝗟𝗘 𝗣𝗟𝗔𝗬", callback_data: "/giftgoogle" }],
            [{ text: "𝗨𝗕𝗘𝗥", callback_data: "/giftuber" }],
            [{ text: "𝗦𝗧𝗘𝗔𝗠", callback_data: "/giftsteam" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })
    DeleteMSG(ctx)


})

bot.action("/giftifood", async ctx => {

    DeleteMSG(ctx)


    const count = await Db.GetCountGift('ifood')

    const msg = "Gift Card ifood:"
    const menu = {
        inline_keyboard: [
            [{ text: `𝗥$𝟭𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟱𝟬 | ${count.v100}`, callback_data: "/finishbuygift ifood 100" }],
            [{ text: `𝗥$𝟮𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟭𝟬𝟬 | ${count.v200}`, callback_data: "/finishbuygift ifood 200" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buygiftcard" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })

})

bot.action("/giftgoogle", async ctx => {

    DeleteMSG(ctx)


    const count = await Db.GetCountGift('google')

    const msg = "Gift Card Google Play:"
    const menu = {
        inline_keyboard: [
            [{ text: `𝗥$𝟭𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟱𝟬 | ${count.v100}`, callback_data: "/finishbuygift google 100" }],
            [{ text: `𝗥$𝟮𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟭𝟬𝟬 | ${count.v200}`, callback_data: "/finishbuygift google 200" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buygiftcard" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })

})

bot.action("/giftuber", async ctx => {

    DeleteMSG(ctx)


    const count = await Db.GetCountGift('uber')

    const msg = "Gift Card Uber:"
    const menu = {
        inline_keyboard: [
            [{ text: `𝗥$𝟭𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟱𝟬 | ${count.v100}`, callback_data: "/finishbuygift uber 100" }],
            [{ text: `𝗥$𝟮𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟭𝟬𝟬 | ${count.v200}`, callback_data: "/finishbuygift uber 200" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buygiftcard" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })

})

bot.action("/giftsteam", async ctx => {

        DeleteMSG(ctx)


    const count = await Db.GetCountGift('steam')

    const msg = "Gift Card Steam:"
    const menu = {
        inline_keyboard: [
            [{ text: `𝗥$𝟭𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟱𝟬 | ${count.v100}`, callback_data: "/finishbuygift steam 100" }],
            [{ text: `𝗥$𝟮𝟬𝟬 𝗣𝗮𝗴𝗮 𝗥$𝟭𝟬𝟬 | ${count.v200}`, callback_data: "/finishbuygift steam 200" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buygiftcard" }]
        ]
    }

    ctx.reply(msg, {
        reply_markup: menu
    })

})

//#endregion




//#region laras

bot.action("/buylara", async ctx => {
        DeleteMSG(ctx)


    const count = await Db.GetCountlara()

    const msg = `Contas Laras:`
    const menu = {
        inline_keyboard: [
            [{ text: `𝗠𝗘𝗥𝗖𝗔𝗗𝗢 𝗣𝗔𝗚𝗢 | ${count.countMp}`, callback_data: "/buylaramp" }],
            [{ text: `𝗥𝗘𝗖𝗔𝗥𝗚𝗔 𝗣𝗔𝗬 | ${count.countRp}`, callback_data: "/buylararp" }],
            [{ text: `𝟵𝟵 𝗣𝗔𝗬 | ${count.count99}`, callback_data: "/buylara99" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})

//#endregion




//#region Login

bot.action("/buylogin", (ctx) => {
    DeleteMSG(ctx)

    const msg = `🛒 𝗟𝗼𝗴𝗶𝗻

- Escolha abaixo o produto que deseja comprar.`
    const menu = {
        inline_keyboard: [
            [{ text: "🛒 𝗖𝗔𝗦𝗔𝗦 𝗕𝗔𝗛𝗜𝗔", callback_data: "/buylogin20 casas_bahia" }],
            [{ text: "🤭 𝗠𝗔𝗚𝗔𝗭𝗜𝗡𝗘 𝗟𝗨𝗜𝗭𝗔", callback_data: "/buylogin20 magazine_luisa" }],
            [{ text: "🥵 𝗔𝗠𝗘𝗥𝗜𝗖𝗔𝗡𝗔𝗦", callback_data: "/buylogin20 americanas" }],
            [{ text: "🟡 𝗔𝗠𝗔𝗭𝗢𝗡", callback_data: "/buylogin20 amazon" }],
            [{ text: "😋 𝗜𝗙𝗢𝗢𝗗", callback_data: "/buylogin20 ifood" }],
            [{ text: "😝 𝗭𝗘 𝗗𝗘𝗟𝗜𝗩𝗘𝗥𝗬", callback_data: "/buylogin15 ze_delivery" }],
            [{ text: "🚗 𝗨𝗕𝗘𝗥", callback_data: "/buylogin15 uber" }],
            [{ text: "🚙 𝟵𝟵 𝗣𝗢𝗣 ", callback_data: "/buylogin15 99_pop" }],
            [{ text: "✨ 𝗖𝗔𝗥𝗥𝗘𝗙𝗢𝗨𝗥 ", callback_data: "/buylogin15 carrefour" }],
            [{ text: "🛍 𝗥𝗘𝗡𝗡𝗘𝗥", callback_data: "/buylogin15 renner" }],
            [{ text: "🐊 𝗟𝗔𝗖𝗢𝗦𝗧𝗘 ", callback_data: "/buylogin15 lacoste" }],
            [{ text: "😎 𝗔𝗗𝗜𝗗𝗔𝗦", callback_data: "/buylogin15 adidas" }],
            [{ text: "🤪 𝗡𝗘𝗧𝗦𝗛𝗢𝗘𝗦", callback_data: "/buylogin15 netshoes" }],
            [{ text: "😜 𝗖𝗘𝗡𝗧𝗔𝗨𝗥𝗢", callback_data: "/buylogin15 centauro" }],
            [{ text: "🙂‍↔ 𝗦𝗛𝗢𝗣𝗘𝗧𝗜𝗠𝗘", callback_data: "/buylogin15 shopetime" }],
            [{ text: "⚫ 𝗧𝗢𝗧𝗔𝗟 𝗔𝗖𝗘𝗦𝗦𝗢", callback_data: "/buylogin15 total_acesso" }],
            [{ text: "🔵 𝗣𝗔𝗚𝗨𝗘 𝗠𝗘𝗡𝗢𝗦", callback_data: "/buylogin15 pague_menos" }],
            [{ text: "🟢 𝗣𝗘𝗧𝗭", callback_data: "/buylogin15 petz" }],
            [{ text: "⚪ 𝗢𝗕𝗢𝗧𝗜𝗖𝗔𝗥𝗜𝗢", callback_data: "/buylogin15 oboticario" }],
            [{ text: "🟣 𝗔𝗩𝗢𝗡", callback_data: "/buylogin15 avon" }],
            [{ text: "🟠 𝗞𝗔𝗕𝗨𝗠", callback_data: "/buylogin15 kabum" }],
            [{ text: "🔴 𝗣𝗜𝗖𝗛𝗔𝗨", callback_data: "/buylogin15 pichau" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buy" }]
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})




//#endregion




//#region Contas Premiun


bot.action("/buyconta", ctx => {
    DeleteMSG(ctx)

    const msg = `𝗖𝗢𝗡𝗧𝗔𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠:`
    const menu = {
        inline_keyboard: [
            [{ text: "🖥 𝗧𝗘𝗟𝗔 ", callback_data: "/buycontatelas" }],
            [{ text: "🗃 𝗖𝗢𝗡𝗧𝗔", callback_data: "/buycontaconta" }],
            [{ text: "👾 𝗛𝗜𝗧 ", callback_data: "/buycontahit" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buy" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})

bot.action("/buycontatelas", async ctx => {
    DeleteMSG(ctx)

    const count = await Db.GetCountTela()


    const msg = `⚠ 𝗔𝗢 𝗖𝗟𝗜𝗖𝗔𝗥 𝗡𝗢 𝗣𝗥𝗢𝗗𝗨𝗧𝗢 𝗔 𝗖𝗢𝗠𝗣𝗥𝗔 𝗦𝗘𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔!!!`
    const menu = {
        inline_keyboard: [
            [{ text: `${count.netflix} | 𝗧𝗘𝗟𝗔 𝗡𝗘𝗧𝗙𝗟𝗜𝗫 𝟰𝗞 R$ 10,00 `, callback_data: "/finishbuytela netflix 10" }],
            [{ text: `${count.prime_video} | 𝗧𝗘𝗟𝗔 𝗣𝗥𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢 (𝟯𝗠) R$ 7,00`, callback_data: "/finishbuytela prime_video 7 3m" }],
            [{ text: `${count.combo} | 𝗧𝗘𝗟𝗔 𝗖𝗢𝗠𝗕𝗢+ R$ 7,00`, callback_data: "/finishbuytela combo 7" }],
            [{ text: `${count.star} | 𝗧𝗘𝗟𝗔 𝗦𝗧𝗔𝗥+ R$ 5,00`, callback_data: "/finishbuytela star 5" }],
            [{ text: `${count.disney} | 𝗧𝗘𝗟𝗔 𝗗𝗜𝗦𝗡𝗘𝗬+ R$ 5,00`, callback_data: "/finishbuytela disney 5" }],
            [{ text: `${count.max_paramount} | 𝗧𝗘𝗟𝗔 𝗠𝗔𝗫 + 𝗣𝗔𝗥𝗔𝗠𝗢𝗨𝗡𝗧 R$ 6,00`, callback_data: "/finishbuytela max_paramount 6" }],
            [{ text: `${count.globo_canais} | 𝗧𝗘𝗟𝗔 𝗚𝗟𝗢𝗕𝗢 + 𝗖𝗔𝗡𝗔𝗜𝗦 R$ 5,00`, callback_data: "/finishbuytela globo_canais 5" }],
            [{ text: `${count.globo_completa} | 𝗧𝗘𝗟𝗔 𝗚𝗟𝗢𝗕𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔 R$ 15,00`, callback_data: "/finishbuytela globo_completa 15" }],
            [{ text: `${count.premiere} | 𝗧𝗘𝗟𝗔 𝗣𝗥𝗘𝗠𝗜𝗘𝗥𝗘 R$ 5,00`, callback_data: "/finishbuytela premiere 5" }],
            [{ text: `${count.spotify} | 𝗖𝗢𝗡𝗩𝗜𝗧𝗘 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 (𝟯𝗠) R$ 10,00`, callback_data: "/finishbuytela spotify 10 3m" }],
            [{ text: `${count.youtube} | 𝗖𝗢𝗡𝗩𝗜𝗧𝗘 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 R$ 4,00`, callback_data: "/finishbuytela youtube 4" }],
            [{ text: `${count.canva} | 𝗖𝗢𝗡𝗩𝗜𝗧𝗘 𝗖𝗔𝗡𝗩𝗔 𝗣𝗥𝗢 R$ 2,0`, callback_data: "/finishbuytela canva 2" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buyconta" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })

})

bot.action("/buycontaconta", async ctx => {
    DeleteMSG(ctx)

    const count = await Db.GetCountConta()

    //     𝗖𝗢𝗡𝗧𝗔 𝗖𝗟𝗔𝗥𝗢 𝗧𝗩 + 𝗘𝗫𝗧𝗥𝗔𝗦 R$ 17,00
    // 𝗖𝗢𝗡𝗧𝗔 𝗦𝗞𝗬 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔 R$ 20,00
    // 𝗖𝗢𝗡𝗧𝗔 𝗖𝗥𝗨𝗡𝗖𝗛𝗬𝗥𝗢𝗟𝗟 R$ 7,00
    // 𝗖𝗢𝗡𝗧𝗔 𝗗𝗘𝗘𝗭𝗘𝗦 (𝟯𝗠) R$ 12,00 
    // 𝗖𝗢𝗡𝗧𝗔 𝗗𝗜𝗦𝗖𝗢𝗩𝗘𝗥𝗬 R$ 8,00
    // 𝗖𝗢𝗡𝗧𝗔 𝗠𝗬 𝗙𝗔𝗠𝗜𝗟𝗬 𝗖𝗜𝗡𝗘𝗠𝗔 R$ 9,0

    const msg = `⚠ 𝗔𝗢 𝗖𝗟𝗜𝗖𝗔𝗥 𝗡𝗢 𝗣𝗥𝗢𝗗𝗨𝗧𝗢 𝗔 𝗖𝗢𝗠𝗣𝗥𝗔 𝗦𝗘𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔!!`
    const menu = {
        inline_keyboard: [
            [{ text: `${count.claro} | 𝗖𝗢𝗡𝗧𝗔 𝗖𝗟𝗔𝗥𝗢 𝗧𝗩 + 𝗘𝗫𝗧𝗥𝗔𝗦 R$ 17,00`, callback_data: "/finishbuyconta claro_tv 17" }],
            [{ text: `${count.sky} | 𝗖𝗢𝗡𝗧𝗔 𝗦𝗞𝗬 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔 R$ 20,00`, callback_data: "/finishbuyconta sky 20" }],
            [{ text: `${count.crunchyroll} | 𝗖𝗢𝗡𝗧𝗔 𝗖𝗥𝗨𝗡𝗖𝗛𝗬𝗥𝗢𝗟𝗟 R$ 7,00`, callback_data: "/finishbuyconta crunchyroll 7" }],
            [{ text: `${count.deezes} | 𝗖𝗢𝗡𝗧𝗔 𝗗𝗘𝗘𝗭𝗘𝗦 (𝟯𝗠) R$ 12,00`, callback_data: "/finishbuyconta deezes 12 3m" }],
            [{ text: `${count.discovery} | 𝗖𝗢𝗡𝗧𝗔 𝗗𝗜𝗦𝗖𝗢𝗩𝗘𝗥𝗬 R$ 8,00`, callback_data: "/finishbuyconta discovery 8" }],
            [{ text: `${count.my_family_cinema} | 𝗖𝗢𝗡𝗧𝗔 𝗠𝗬 𝗙𝗔𝗠𝗜𝗟𝗬 𝗖𝗜𝗡𝗘𝗠𝗔 R$ 9,0`, callback_data: "/finishbuyconta my_family_cinema 9" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buyconta" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })

})

bot.action("/buycontahit", async ctx => {
    DeleteMSG(ctx)

    const count = await Db.GetCountHit()
    const msg = `⚠ 𝗔𝗢 𝗖𝗟𝗜𝗖𝗔𝗥 𝗡𝗢 𝗣𝗥𝗢𝗗𝗨𝗧𝗢 𝗔 𝗖𝗢𝗠𝗣𝗥𝗔 𝗦𝗘𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔!!`
    const menu = {
        inline_keyboard: [
            [{ text: `${count.netflix} | 𝗛𝗜𝗧 𝗡𝗘𝗧𝗙𝗟𝗜𝗫 R$ 6,00`, callback_data: "/finishbuyhit netflix 6" }],
            [{ text: `${count.max} | 𝗛𝗜𝗧 𝗠𝗔𝗫 R$ 3,00`, callback_data: "/finishbuyhit max 3" }],
            [{ text: `${count.combo} | 𝗛𝗜𝗧 𝗖𝗢𝗠𝗕𝗢+ R$ 4,00`, callback_data: "/finishbuyhit combo 4" }],
            [{ text: `${count.disney} | 𝗛𝗜𝗧 𝗗𝗜𝗦𝗡𝗘𝗬+ R$ 3,00`, callback_data: "/finishbuyhit disney 3" }],
            [{ text: `${count.star} | 𝗛𝗜𝗧 𝗦𝗧𝗔𝗥+ R$ 3,00`, callback_data: "/finishbuyhit star 3" }],
            [{ text: `${count.crunchyroll} | 𝗛𝗜𝗧 𝗖𝗥𝗨𝗡𝗖𝗛𝗬𝗥𝗢𝗟𝗟 R$ 3,00`, callback_data: "/finishbuyhit crunchyroll 3" }],
            [{ text: `${count.sky} | 𝗛𝗜𝗧 𝗦𝗞𝗬 R$ 3,00`, callback_data: "/finishbuyhit sky 3" }],
            [{ text: `${count.claro} | 𝗛𝗜𝗧 𝗖𝗟𝗔𝗥𝗢 𝗧𝗩 R$ 3,00`, callback_data: "/finishbuyhit claro 3" }],
            [{ text: `${count.play_plus} | 𝗛𝗜𝗧 𝗣𝗟𝗔𝗬 𝗣𝗟𝗨𝗦 R$ 3,00`, callback_data: "/finishbuyhit play_plus 3" }],
            [{ text: `${count.directgo} | 𝗛𝗜𝗧 𝗗𝗜𝗥𝗘𝗖𝗧𝗚𝗢 R$ 3,00`, callback_data: "/finishbuyhit directgo 3" }],
            [{ text: `${count.my_family_cinema} | 𝗛𝗜𝗧 𝗠𝗬 𝗙𝗔𝗠𝗜𝗟𝗬 𝗖𝗜𝗡𝗘𝗠𝗔 R$ 3,00`, callback_data: "/finishbuyhit my_family_cinema 3" }],
            [{ text: `${count.tv_express} | 𝗛𝗜𝗧 𝗧𝗩 𝗘𝗫𝗣𝗥𝗘𝗦𝗦 R$ 3,00`, callback_data: "/finishbuyhit tv_express 3" }],
            [{ text: `${count.oi_plus} | 𝗛𝗜𝗧 𝗢𝗜 𝗣𝗟𝗨𝗦 R$ 3,00`, callback_data: "/finishbuyhit oi_plus 3" }],
            [{ text: `${count.univer_video} | 𝗛𝗜𝗧 𝗨𝗡𝗜𝗩𝗘𝗥 𝗩𝗜𝗗𝗘𝗢 R$ 3,00`, callback_data: "/finishbuyhit univer_video 3" }],
            [{ text: `${count.ufc_pass} | 𝗛𝗜𝗧 𝗨𝗙𝗖 𝗣𝗔𝗦𝗦 R$ 4,00`, callback_data: "/finishbuyhit ufc_pass 4" }],
            [{ text: `${count.tufos} | 𝗛𝗜𝗧 𝗧𝗨𝗙𝗢𝗦 +𝟭𝟴 R$ 4,0`, callback_data: "/finishbuyhit tufos 4" }],
            [{ text: `↩️ 𝗩𝗢𝗟𝗧𝗔𝗥`, callback_data: "/buyconta" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })

})




//#endregion


//#region Editavel

bot.action("/buyeditavel", ctx => {
    DeleteMSG(ctx)


    const msg = `🪪 Editaveis:`
    const menu = {
        inline_keyboard: [
            [{ text: "𝗥𝗚 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 RG" }],
            [{ text: "𝗖𝗡𝗛 -  𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 CNH" }],
            [{ text: "𝗖𝗡𝗛 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 + 𝗔𝗣𝗣 - 𝟭𝟬𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 100 CNH_DIGITAL_+_APP" }],
            [{ text: "𝗖𝗥𝗟𝗩/𝗗𝗨𝗧 -  𝟴𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 80 CRLV/DUT" }],
            [{ text: "𝗛𝗢𝗟𝗘𝗥𝗜𝗧𝗘/𝗗𝗘𝗖𝗢𝗥𝗘 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 HOLERITE/DECORE" }],
            [{ text: "𝗖𝗢𝗠𝗣. 𝗥𝗘𝗡𝗗𝗔 - 𝟱𝟬,00", callback_data: "/finishbuyeditavel 50 COMP._RENDA" }],
            [{ text: "𝗖𝗢𝗠𝗣. 𝗘𝗡𝗗𝗘𝗥𝗘𝗖𝗢 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 COMP._ENDEREÇO" }],
            [{ text: "𝗖𝗢𝗠𝗣. 𝗣𝗔𝗚𝗔𝗠𝗘𝗡𝗧𝗢 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 COMP._PAGAMENTO" }],
            [{ text: "𝗧𝗜𝗧𝗨𝗟𝗢 𝗗𝗘 𝗘𝗟𝗘𝗜𝗧𝗢𝗥 - 𝟱𝟱,𝟬𝟬", callback_data: "/finishbuyeditavel 55 TITULO_DE_ELEITOR" }],
            [{ text: "𝗘𝗗𝗜𝗧. 𝗖𝗔𝗥𝗗 𝗣𝗩𝗖 - 𝟲𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 60 EDIT._CARD_PVC" }],
            [{ text: "𝗔𝗧𝗘𝗦𝗧𝗔𝗗𝗢 𝗠𝗘𝗗𝗜𝗖𝗢 - 𝟳𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 70 ATESTADO_MEDICO" }],
            [{ text: "𝗡𝗢𝗧𝗔 𝗙𝗜𝗦𝗖𝗔𝗟 -  𝟴𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 80 NOTA_FISCAL" }],
            [{ text: "𝗙𝗔𝗧𝗨𝗥𝗔𝗦 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 FATURAS" }],
            [{ text: "𝗥𝗘𝗖𝗜𝗕𝗢 - 𝟱𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 50 RECIBO" }],
            [{ text: "𝗛𝗜𝗦𝗧. 𝗘𝗦𝗖𝗢𝗟𝗔𝗥 - 𝟴𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 80 HIST._ESCOLAR" }],
            [{ text: "𝗘𝗫𝗧. 𝗕𝗔𝗡𝗖𝗔𝗥𝗜𝗢 -  𝟴𝟬,𝟬𝟬", callback_data: "/finishbuyeditavel 80 EXT._BANCARIO" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buy" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})

//#endregion

//#region Notas fakes

bot.action("/buynotas", ctx => {
    DeleteMSG(ctx)

    const msg = `💵 𝗡𝗼𝘁𝗮 𝗙𝗮𝗸𝗲:`
    const menu = {
        inline_keyboard: [
            [{ text: "𝗖𝗼𝗺𝘂𝗺", callback_data: "/buynotascomum" }],
            [{ text: "𝗙𝗶𝗯𝗿𝗮𝗱𝗮", callback_data: "/buynotasfibrada" }],
            [{ text: "𝗜𝗺𝗽𝗼𝗿𝘁𝗮𝗱𝗮 ", callback_data: "/buynotasimportada" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buy" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})


bot.action("/buynotascomum", ctx => {
    DeleteMSG(ctx)

    const msg = `💵 𝗖𝗼𝗺𝘂𝗺:`
    const menu = {
        inline_keyboard: [
            [{ text: "𝟭𝗞 - 𝗥$: 𝟭𝟱𝟬", callback_data: "/buynotafake comum 1 150" }],
            [{ text: "𝟮𝗞 - 𝗥$: 𝟯𝟬𝟬", callback_data: "/buynotafake comum 2 300" }],
            [{ text: "𝟱𝗞 - 𝗥$: 𝟳𝟬𝟬 ", callback_data: "/buynotafake comum 5 700" }],
            [{ text: "𝟭𝟬𝗞 - 𝗥$: 𝟭𝗸", callback_data: "/buynotafake comum 10 1000" }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buynotas" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})


bot.action("/buynotasfibrada", ctx => {
    DeleteMSG(ctx)

    const msg = `💵 𝗙𝗶𝗯𝗿𝗮𝗱𝗮:`
    const menu = {
        inline_keyboard: [
            [{ text: "𝟭𝗞 - 𝗥$: 𝟮𝟬𝟬", callback_data: "/buynotafake fibrada 1 200" }],
            [{ text: "𝟮𝗞 - 𝗥$: 𝟰𝟬𝟬", callback_data: "/buynotafake fibrada 2 400" }],
            [{ text: "𝟱𝗞 - 𝗥$: 𝟴𝟬𝟬 ", callback_data: "/buynotafake fibrada 5 800" }],
            [{ text: "𝟭𝟬𝗞 - 𝗥$: 𝗥$: 𝟭.𝟱𝗸", callback_data: "/buynotafake fibrada 10 1500 " }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buynotas" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})


bot.action("/buynotasimportada", ctx => {
    DeleteMSG(ctx)

    const msg = `💵 𝗜𝗺𝗽𝗼𝗿𝘁𝗮𝗱𝗮:`
    const menu = {
        inline_keyboard: [
            [{ text: "𝟭𝗞 - 𝗥$: 𝟮𝟱𝟬", callback_data: "/buynotafake importada 1 250" }],
            [{ text: "𝟮𝗞 - 𝗥$: 𝟯𝟱𝟬", callback_data: "/buynotafake importada 2 350" }],
            [{ text: "𝟱𝗞 - 𝗥$: 𝟴𝟱𝟬 ", callback_data: "/buynotafake importada 5 850" }],
            [{ text: "𝟭𝟬𝗞 - 𝗥$: 𝟭.𝟳𝗸", callback_data: "/buynotafake importada 10 1700 " }],
            [{ text: "↩️ 𝗩𝗢𝗟𝗧𝗔𝗥", callback_data: "/buynotas" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
})

//#endregion



//#endregion



//===================================================================================
//                  Usuarios
//===================================================================================

//#region Usuario

bot.command("gift", async ctx => {
    const code = ctx.message.text.split(" ")[1]
    const user = ctx.chat.id

    const response = await Db.GiftReward(code, user)

    ctx.reply(response.msg)
})


//#endregion




//===================================================================================
//                  Termos
//===================================================================================

//#region Termos

bot.action("/termos", ctx => {
    const msg = `📖 Termos de trocas: 📖`
    const menu = {
        inline_keyboard: [
            [{ text: " 💳 𝗜𝗻𝗳𝗼 𝗖𝗖", callback_data: "/termoccfull" }],
            [{ text: " 💳 𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝗱𝗮", callback_data: "/termoccconsultada" }],
            [{ text: " 💳 𝗖𝗖 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝘃𝗲𝗹", callback_data: "/termoccconsultavel" }],
            [{ text: " 🛒 𝗦𝘁𝗿𝗲𝗮𝗺𝗶𝗻𝗴", callback_data: "/termostreaming" }],
            [{ text: " 🛒 𝗟𝗼𝗴𝗶𝗻", callback_data: "/termoslogin" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })

    DeleteMSG(ctx)
})

bot.action("/termoccfull", ctx => {
    const msg = `
❌ REGRAS INFO CC FULL ❌

♻️ PASSO A PASSO PARA SOLICITAR TROCA:

1️⃣ - CRIE UM CADASTRO EM UMA DAS SEGUINTES LOJAS: AMERICANAS, SUBMARINO, MAGAZINE LUIZA OU SHOPTIME. 

🚫 - NÃO ACEITAMOS QUAIS QUER SITES QUE NÃO ESTÃO CITADOS NOS TERMOS.

2️⃣ - SELECIONE UM PRODUTO COM UM VALOR DE ATÉ R$ 50,00.

3️⃣ - REALIZE UM TESTE COM AS INFORMACÕES DA INFO E GRAVE UM VIDEO DEMONSTRANDO O TESTE.

4️⃣ - EM SWGUIDA ENCAMINHE A INFO COMPRADA JUNTAMENTE DO VIDEO GRAVADO PARA O CHAT DO ATENDIMENTO;

🕗 PRAZO DE 10 MINUTOS APÓS A COMPRA.

AGUARDE A ANÁLISE DO ATENDIMENTO PARA VERIFICAR SE OS PASSO FORAM SEGUIDOS CORRETAMENTE E SE AS INFORMACÕES FORAM INSERIDAS DE FORMA CORRETA. NÃO NOS RESPONSABILIZAMOS POR ERROS DE DIGITAÇÃO DA INFO NO ATO DO TESTE OU POR ENVIO FORA DO PRAZO ESTABELECIDO.    
`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termos" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

bot.action("/termoccconsultada", ctx => {
    const msg = `
❌ REGRAS CC CONSULTADA ❌

♻️ PASSO A PASSO PARA SOLICITAR TROCA:

1️⃣ - LIGUE PARA O BANCO NO NUMERO QUE FOI ENVIADO JUNTAMENTE COM A INFO, INICIE A GRAVAÇÃO DA LIGAÇÃO DE INICIO AO FIM CONSULTANDO O LIMITE DA INFO.

2️⃣ - CASO AJA ALTERAÇÃO DE LIMITE NA INFO, PROVADO COM A LIGAÇÃO DE INICIO AO FIM. SERA ENVIADO 1 INFO CC FULL A CADA 400 DE LIMITE REDUZIDO NA CONSULTADA. 

🕗 PRAZO DE 2 HORAS APÓS A COMPRA.

AGUARDE A ANÁLISE DO ATENDIMENTO PARA VERIFICAR SE OS PASSO FORAM SEGUIDOS CORRETAMENTE E SE AS INFORMACÕES FORAM INSERIDAS DE FORMA CORRETA. PEDIDOS DE TROCAS FORA DO PRASO ESTABELECIDO SERA IGNORADO.
    `
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termos" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

bot.action("/termoccconsultavel", ctx => {
    const msg = `
❌ REGRAS CC CONSULTAVEL ❌

♻️ PASSO A PASSO PARA SOLICITAR TROCA:

1️⃣ - LIGUE PARA O BANCO NO NUMERO QUE FOI ENVIADO JUNTAMENTE COM A INFO, INICIE A GRAVAÇÃO DA LIGAÇÃO DE INICIO AO FIM CONSULTANDO DATA OU CVV ERRADO.

2️⃣ - CASO AJA ERRO PROVADO COM A LIGAÇÃO DE INICIO AO FIM COM O ATENDENTE TERA DIREITO A TROCA. 

🕗 PRAZO DE 2 HORAS APÓS A COMPRA.

AGUARDE A ANÁLISE DO ATENDIMENTO PARA VERIFICAR SE OS PASSO FORAM SEGUIDOS CORRETAMENTE E SE AS INFORMACÕES FORAM INSERIDAS DE FORMA CORRETA. PEDIDOS DE TROCAS FORA DO PRASO ESTABELECIDO SERA IGNORADO.`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termos" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

bot.action("/termostreaming", ctx => {
    const msg = `Termos streaming:`
    const menu = {
        inline_keyboard: [
            [{ text: " 𝗛𝗶𝘁", callback_data: "/termohit" }],
            [{ text: " 𝗧𝗲𝗹𝗮", callback_data: "/termotela" }],
            [{ text: " 𝗖𝗼𝗻𝘁𝗮", callback_data: "/termoconta" }],
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termos" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

bot.action("/termohit", ctx => {
    const msg = `⚠ "Contas da aba Hit" Não tem garantia de tempo validade, Não garantimos tempo de vida da conta Hit. 

❗ Garantimos apenas conta Logando e com plano ativo no momento em que o material foi entregue!

✅ Suporte: @SuporteRycaStore`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termostreaming" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})


bot.action("/termotela", ctx => {
    const msg = `⚠ "Tela" garantia de 30 dias de validade. 

❗ Não use Telas de terceiros, e não compartilhe seu acesso com terceiros.

❗ Não altere a senha para não perder o suporte!

✅ Suporte: @SuporteRycaStore`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termostreaming" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})


bot.action("/termoconta", ctx => {
    const msg = `⚠ "Contas da aba Conta" Será exclusivamente sua pendendo criar perfis etc, suporte de 30 dias.

❗ as contas com (3M) etc são os meses que são dados de garantia pra aquele tipo de conta!

✅ Suporte: @SuporteRycaStore`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termostreaming" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

bot.action("/termoslogin", ctx => {
    const msg = `⚠ Garantia de Login com compra aprovada e login batendo email. 

❗ Não garantimos quaisquer tipo de trampo ou sua aprovação, garantimos apenas nosso material.

✅ Suporte: @SuporteRycaStore`
    const menu = {
        inline_keyboard: [
            [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/termos" }],
        ]
    }

    ctx.reply(msg, { reply_markup: menu })
    DeleteMSG(ctx)
})

//#endregion













//===================================================================================
//                  Sistema de compras 
//===================================================================================


bot.action(async (e, ctx) => {
    let command = e.split(" ")[0]
    let args = e.split(" ").slice(1)
    let user = await Db.CheckUser(ctx.chat)

    //#region  Sistema de historico


    if (command == '/hisbuy') {


        const type = args[0]
        const index = args[1]

        const infos = user.buys[type][index]
        const maxInfos = user.buys[type].length

        if (maxInfos < 1) return
        DeleteMSG(ctx)

        var msg
        var menu = {}

        if (type == 'ccfull') msg = `🛒 Compra Infos CC numero: ${+index + 1} de ${maxInfos} 

🔰 PEDIDO

    Card ${infos.num}
    Validade ${infos.val}
    Cvv ${infos.cvv}

    CPF ${infos.cpf}
    Nome ${infos.nome}

    ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}
    
${infos.data}

        `
        if (type == 'ccconsultada') msg = `🛒 Compra CC Consultada numero: ${+index + 1} de ${maxInfos}
        
🔰 PEDIDO

    Card ${infos.num}
    Validade ${infos.val}
    Cvv ${infos.cvv}
    Senha ${infos.pass}

    Melhor Limite: ${infos.limit}

    CPF ${infos.cpf}
    Nome ${infos.nome}

    ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}

${infos.data}
    `
        if (type == 'ccconsultavel') msg = `🛒 Compra CC Consultavel numero: ${+index + 1} de ${maxInfos}
🔰 PEDIDO

    Card ${infos.num}
    Validade ${infos.val}
    Cvv ${infos.cvv}
    Senha ${infos.pass}

    CPF ${infos.cpf}
    Nome ${infos.nome}

 ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}


${infos.data}
        `
        if (type == 'gift') msg = `🛒 Compra GIFTCARD numero: ${+index + 1} de ${maxInfos}

🔰 PEDIDO

TIPO: ${infos.type.toUpperCase()}

CODE: ${infos.code}

VALOR: ${infos.value}

${infos.data}
        `
        if (type == 'lara') msg = `🛒 Compra LARA numero: ${+index + 1} de ${maxInfos}

${infos.type == "99 pay" ? `👍 LARA ${infos.type.toUpperCase()} PF` : `👍 LARA ${infos.type.toUpperCase()} PF ${infos.sexo == "M" ? "MASCULINA" : "FEMININA"}

EMAIL: ${infos.email}

NOME: ${infos.name} 

CPF: ${infos.cpf}
`}
        
${infos.data}
        `
        if (type == 'logins') msg = `🛒 Compra LOGIN numero: ${+index + 1} de ${maxInfos}
🔰 PEDIDO

LOJA: ${infos.type.toUpperCase()}

EMAIL: ${infos.email}

SENHA: ${infos.pass}

${infos.state ? infos.state : ""}

${infos.data}
        `
        if (type == 'contas') msg = `🛒 Compra STREAMING numero: ${+index + 1} de ${maxInfos}
🔰 PEDIDO

TIPO: ${infos.type.toUpperCase()}

${infos.link ? `LINK: ${infos.link}
` : `
EMAIL: ${infos.email}

SENHA: ${infos.pass}

${infos.numTela ? `NUMERO DA TELA: ${infos.numTela}
` : ""}${infos.pin ? `PIN: ${infos.pin}
` : ""}`}
${infos.data}
        `
        if (type == 'notas') msg = `🛒 Compra NOTAS numero: ${+index + 1} de ${maxInfos}
🔰 PEDIDO

TIPO: ${infos.type.toUpperCase()}

QUANTIDADE: ${infos.quant}K

${infos.data}
        `
        if (type == 'editavel') msg = `🛒 Compra EDITAVEIS numero: ${+index + 1} de ${maxInfos}
🔰 PEDIDO

TIPO: ${infos.type.toUpperCase()}

QUANTIDADE: 1

${infos.data}
        `

        if (index <= 0) menu = {
            inline_keyboard: [
                [
                    { text: "➡️", callback_data: `/hisbuy ${type} ${+index + 1}` },
                ],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/historico' }],
            ]
        }
        else if (index >= maxInfos - 1) menu = {
            inline_keyboard: [
                [
                    { text: "⬅️", callback_data: `/hisbuy ${type} ${+index - 1}` },
                ],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/historico' }],
            ]
        }
        else menu = {
            inline_keyboard: [
                [
                    { text: "⬅️", callback_data: `/hisbuy ${type} ${+index - 1}` },
                    { text: "➡️", callback_data: `/hisbuy ${type} ${+index + 1}` },
                ],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/historico' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    //#endregion





    //#region Sistemas de compras


    // =======================================================
    //                  CC FULL 
    // =======================================================

    //#region Sistema CC full


    if (command == "/buyinfoccbytype") {
        let nivel = args[0]
        let infos = await Db.GetInfosByNivel(nivel)

        if (infos.length > 0) {
            let index = 0

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
            
Validade ${infos[index].val}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível
            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccfullinfopreview ${nivel} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccfullinfopreview ${nivel} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccfullinfopreview ${nivel} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccfullinfopreview ${nivel} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
                DeleteMSG(ctx)


        }
    }

    if (command == "/ccfullinfopreview") {
        let nivel = args[0]
        let infos = await Db.GetInfosByNivel(nivel)

        if (infos.length > 0) {
                DeleteMSG(ctx)


            let index = +args[1]

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
            
Validade ${infos[index].val}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível
            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccfullinfopreview ${nivel} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccfullinfopreview ${nivel} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccfullinfopreview ${nivel} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccfullinfopreview ${nivel} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccfull ${infos[index].num}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/ccfullunit" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
        }
    }

    if (command == "/finishbuyccfull") {
        let number = args[0]
        let infos = await Db.BuyCcFull(number, ctx.chat.id, ctx)
        let userRefresh = await Db.CheckUser(ctx.chat)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `
✅ Compra Confirmada
⥬ Level ${infos.nivel}

⥬ Preço R$${infos.price}

⥬ Novo Saldo R$${userRefresh.money.toFixed(2)}

GARANTO LIVE
NÃO GARANTO APROVAÇÃO

🔰 SEU PEDIDO

      Card ${infos.num}
      Validade ${infos.val}
      Cvv ${infos.cvv}

      CPF ${infos.cpf}
      Nome ${infos.nome}

     ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}

⏱ Você tem 10 Minutos para tentar pedir troca depois da entrega de cada CC
`

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
            DeleteMSG(ctx)

    }

    //#endregion





    // =======================================================
    //                  CC consultada 
    // =======================================================

    //#region Sistema CC Consultada

    if (command == "/buyccconsultadabybanco") {
        let banco = args[0]
        let infos = await Db.GetCcConsultada(banco)

        if (infos.length > 0) {
            let index = 0

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
            
Validade ${infos[index].val}

Preço ${infos[index].price}

Saldo ${infos[index].limit}

Mostrando ${index + 1} de ${infos.length} diponível
            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccconsultadainfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultadainfopreview ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultadainfopreview ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccconsultadainfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
                DeleteMSG(ctx)


        }
    }

    if (command == "/ccconsultadainfopreview") {
        let banco = args[0]
        let infos = await Db.GetCcConsultada(banco)

        if (infos.length > 0) {
                DeleteMSG(ctx)


            let index = +args[1]

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
            
Validade ${infos[index].val}

Preço ${infos[index].price}

Saldo ${infos[index].limit}

Mostrando ${index + 1} de ${infos.length} diponível
            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccconsultadainfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultadainfopreview ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultadainfopreview ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccconsultadainfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultada ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultada" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
        }
    }

    if (command == "/finishbuyccconsultada") {
        let number = args[0]
        let banco = args[1]
        let infos = await Db.BuyCcConsultada(banco, number, ctx.chat.id, ctx)
        let userRefresh = await Db.CheckUser(ctx.chat)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `
✅ Compra Confirmada
⥬ Level ${infos.nivel}

⥬ Preço R$${infos.price}

⥬ Novo Saldo R$${userRefresh.money.toFixed(2)}

GARANTO LIVE
NÃO GARANTO APROVAÇÃO

🔰 SEU PEDIDO

      Card ${infos.num}
      Validade ${infos.val}
      Cvv ${infos.cvv}
      Senha ${infos.pass}

      Melhor Limite: ${infos.limit}

      CPF ${infos.cpf}
      Nome ${infos.nome}

     ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}
     ${banco == 'nubank' ? `
    Consulta De limite:
    Nubank
    Capitais e regiões metropolitanas:
    4020 0185
    Demais localidades:
    0800 591 2117
     ` : ""}
     ${banco == 'bb' ? `
    Consulta de Limite:
    Banco do Brasil
    Capitais e regiões metropolitanas: 
    4004 0001
    Demais localidades: 
    0800 729 0001
     ` : ""}
     ${banco == 'caixa' ? `
    Consulta de Limite:
    Caixa
    Capitais e regiões metropolitanas: 
    4004 0104
    Demais localidades: 
    0800 104 0104
     ` : ""}

⏱ Você tem 2 Horas para tentar pedir troca depois da entrega de cada CC
`

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
            DeleteMSG(ctx)

    }

    //#endregion







    // =======================================================
    //                  CC consultavel 
    // =======================================================

    //#region Sistema CC Consultavel

    if (command == "/buyccconsultavelbybanco") {
        let banco = args[0]
        let infos = await Db.GetCcConsultavel(banco)

        if (infos.length > 0) {
            let index = 0

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
        
Validade ${infos[index].val}

Saldo ${infos[index].limit}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível
        `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel~]" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccconsultavelinfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel~]" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultavelinfopreview ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel~]" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultavelinfopreview ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccconsultavelinfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel~]" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
                DeleteMSG(ctx)


        }
    }

    if (command == "/ccconsultavelinfopreview") {
        let banco = args[0]
        let infos = await Db.GetCcConsultavel(banco)

        if (infos.length > 0) {
                DeleteMSG(ctx)


            let index = +args[1]

            const msg = `
Level ${infos[index].nivel} 

Banco ${infos[index].nomBanco}

Bin ${infos[index].num.split("").slice(0, 6).toString().replaceAll(",", "")}
        
Validade ${infos[index].val}

Saldo ${infos[index].limit}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível
        `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/ccconsultavelinfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultavelinfopreview ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/ccconsultavelinfopreview ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/ccconsultavelinfopreview ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuyccconsultavel ${infos[index].num} ${banco}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buyccconsultavel" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
        }
    }

    if (command == "/finishbuyccconsultavel") {
            DeleteMSG(ctx)



        let number = args[0]
        let banco = args[1]
        let infos = await Db.BuyCcConsultavel(banco, number, ctx.chat.id, ctx)
        let userRefresh = await Db.CheckUser(ctx.chat)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `
✅ Compra Confirmada
⥬ Level ${infos.nivel}

⥬ Preço R$${infos.price}

⥬ Novo Saldo R$${userRefresh.money.toFixed(2)}

GARANTO LIVE
NÃO GARANTO APROVAÇÃO

🔰 SEU PEDIDO

  Card ${infos.num}
  Validade ${infos.val}
  Cvv ${infos.cvv}
  Senha ${infos.pass}
  Limite ${infos.limit}

  CPF ${infos.cpf}
  Nome ${infos.nome}

 ${infos.nomBanco}|${infos.nivel}|${infos.band}|${infos.type}|${infos.pais}

⏱ Você tem 10 Minutos para tentar pedir troca depois da entrega de cada CC
`

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    //#endregion




    // =======================================================
    //                       Lara
    // =======================================================

    //#region Sistema Lara

    if (command == "/buylaramp") {
        let banco = args[0]
        let infos = await Db.GetLara('mp')

        if (infos.length > 0) {
            let index = 0

            const msg = `
Lara Pessoa Fisica 

Banco MERCADO PAGO
            
Sexo ${infos[index].sexo == 'M' ? "MASCULINO" : "FEMININO"}
            
Nome ${infos[index].name.split(" ")[0]}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível

            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/laramppreviewmp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewmp ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewmp ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/laramppreviewmp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
                DeleteMSG(ctx)


        }
    }


    if (command == "/laramppreviewmp") {
        let banco = args[0]
        let infos = await Db.GetLara("mp")

        if (infos.length > 0) {
                DeleteMSG(ctx)


            let index = +args[1]

            const msg = `
Lara Pessoa Fisica 

Banco MERCADO PAGO
            
Sexo ${infos[index].sexo == 'M' ? "MASCULINO" : "FEMININO"}
            
Nome ${infos[index].name.split(" ")[0]}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível

            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/laramppreviewmp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewmp ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewmp ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/laramppreviewmp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylaramp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
        }
    }


    if (command == "/finishbuylaramp") {
        DeleteMSG(ctx)


        let cpf = args[0]
        let banco = args[1]
        let infos = await Db.buyLara('mp', cpf, ctx.chat.id, ctx)
        let userRefresh = await Db.CheckUser(ctx.chat)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `
👍 𝗦𝗨𝗔 𝗟𝗔𝗥𝗔 𝗠𝗣 𝗣𝗙 ${infos.sexo == "M" ? "𝗠𝗔𝗦𝗖𝗨𝗟𝗜𝗡𝗔" : "𝗙𝗘𝗠𝗜𝗡𝗜𝗡𝗔"}

✉ 𝗘𝗠𝗔𝗜𝗟: ${infos.email}

Dados completos 

ɴᴏᴍᴇ:
${infos.name} 

ᴄᴘꜰ:
${infos.cpf}

PASSO A PASSO PARA ACESSAR A MP
https://t.me/laramp7

ᴀᴘᴏꜱ ᴇɴᴛʀᴀʀ ɴᴀ ʟᴀʀᴀ ᴇɴᴠɪᴀʀ ᴘʀɪɴᴛ ᴘᴀʀᴀ ᴏ ꜱᴜᴘᴏʀᴛᴇ. 

ᴏʙʀɪɢᴀᴛᴏʀɪᴏ.

ꜱᴜᴘᴏʀᴛᴇ: @SuporteRycaStore
    `

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }


    //RECARGA PAY

    if (command == "/buylararp") {
        let banco = args[0]
        let infos = await Db.GetLara('rp')

        if (infos.length > 0) {
            let index = 0

            const msg = `
Lara Pessoa Fisica 

Banco RECARGA PAY
            
Sexo ${infos[index].sexo == 'M' ? "MASCULINO" : "FEMININO"}
            
Nome ${infos[index].name.split(" ")[0]}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível

            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/laramppreviewrp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewrp ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewrp ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/laramppreviewrp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
                DeleteMSG(ctx)


        }
    }


    if (command == "/laramppreviewrp") {
        let banco = args[0]
        let infos = await Db.GetLara('rp')

        if (infos.length > 0) {
            DeleteMSG(ctx)

            let index = +args[1]

            const msg = `
Lara Pessoa Fisica 

Banco RECARGA PAY
            
Sexo ${infos[index].sexo == 'M' ? "MASCULINO" : "FEMININO"}
            
Nome ${infos[index].name.split(" ")[0]}

Preço ${infos[index].price}

Mostrando ${index + 1} de ${infos.length} diponível

            `

            var menu = {}

            if (index <= 0 && index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],
                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index <= 0) menu = {
                inline_keyboard: [

                    [
                        { text: "➡️", callback_data: `/laramppreviewrp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else if (index + 1 >= infos.length) menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewrp ${banco} ${index - 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }
            else menu = {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: `/laramppreviewrp ${banco} ${index - 1}` },
                        { text: "➡️", callback_data: `/laramppreviewrp ${banco} ${index + 1}` },
                    ],
                    [{ text: "🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿 ", callback_data: `/finishbuylararp ${infos[index].cpf}` }],

                    [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
                ]
            }

            ctx.reply(msg, { reply_markup: menu })
        }
    }


    if (command == "/finishbuylararp") {
        DeleteMSG(ctx)

        let cpf = args[0]
        let banco = args[1]
        let infos = await Db.buyLara('rp', cpf, ctx.chat.id, ctx)
        let userRefresh = await Db.CheckUser(ctx.chat)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `
👍 𝗦𝗨𝗔 𝗟𝗔𝗥𝗔 𝗥𝗣 𝗣𝗙 ${infos.sexo == "M" ? "𝗠𝗔𝗦𝗖𝗨𝗟𝗜𝗡𝗔" : "𝗙𝗘𝗠𝗜𝗡𝗜𝗡𝗔"}

✉ 𝗘𝗠𝗔𝗜𝗟: ${infos.email}
   𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

Dados completos 

ɴᴏᴍᴇ:
${infos.name} 

ᴄᴘꜰ:
${infos.cpf}

ᴀᴘᴏꜱ ᴇɴᴛʀᴀʀ ɴᴀ ʟᴀʀᴀ ᴇɴᴠɪᴀʀ ᴘʀɪɴᴛ ᴘᴀʀᴀ ᴏ ꜱᴜᴘᴏʀᴛᴇ. 

ᴏʙʀɪɢᴀᴛᴏʀɪᴏ.

ꜱᴜᴘᴏʀᴛᴇ: @SuporteRycaStore
    `

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    //99 pay

    if (command == "/buylara99") {
        DeleteMSG(ctx)

        const count = await Db.GetCountlara()

        const msg = `🛒 𝗟𝗔𝗥𝗔 𝟵𝟵𝗣𝗔𝗬 🛒
├💸| 𝗩𝗔𝗟𝗢𝗥: 50.00
├💰| 𝗦𝗘𝗨 𝗦𝗔𝗟𝗗𝗢: ${user.money}
└📦| 𝗘𝗦𝗧𝗢𝗤𝗨𝗘: ${count.count99}`
        const menu = {
            inline_keyboard: [
                [{ text: `🛒 𝗖𝗢𝗠𝗣𝗥𝗔𝗥`, callback_data: `/finishbuylara99` }],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylara" }]
            ]
        }

        ctx.reply(msg, {reply_markup: menu})
    }


    if (command == "/finishbuylara99") {
        DeleteMSG(ctx)

        let cpf = args[0]
        let infos = await Db.buyLara99('rp', cpf, ctx.chat.id, ctx)

        if (infos.error) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }

        const msg = `✅ 𝗖𝗢𝗠𝗣𝗥𝗔 𝗘𝗙𝗘𝗧𝗨𝗔𝗗𝗔

𝗟𝗔𝗥𝗔 𝟵𝟵𝗣𝗔𝗬

✅ LARA NO SEU NUMERO E EMAIL 

chame o suporte para fornecer os dados "número e email" para o envio da conta.

    `

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: '/start' }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    //#endregion


    // =======================================================
    //                       Logins
    // =======================================================

    //#region Sistema Logins 

    if (command == "/buylogin20") {
        DeleteMSG(ctx)

        const login = args[0]
        const count = await Db.GetCountLogin(login)


        const msg = `🛍 𝗟𝗢𝗚𝗜𝗡: ${login.replace("_", " ").toUpperCase()} 🛍
├💸| 𝗩𝗔𝗟𝗢𝗥: 20.00
├💰| 𝗦𝗘𝗨 𝗦𝗔𝗟𝗗𝗢: ${user.money}
└📦| 𝗘𝗦𝗧𝗢𝗤𝗨𝗘: ${count.all}
        `
        const menu = {
            inline_keyboard: [
                [{ text: `SP | ${count.SP}`, callback_data: `/finishbuylogin20 ${login} SP` }],
                [{ text: `AC | ${count.AC}`, callback_data: `/finishbuylogin20 ${login} AC` }],
                [{ text: `AL | ${count.AL}`, callback_data: `/finishbuylogin20 ${login} AL` }],
                [{ text: `AP | ${count.AP}`, callback_data: `/finishbuylogin20 ${login} AP` }],
                [{ text: `AM | ${count.AM}`, callback_data: `/finishbuylogin20 ${login} AM` }],
                [{ text: `CE | ${count.CE}`, callback_data: `/finishbuylogin20 ${login} CE` }],
                [{ text: `DF | ${count.DF}`, callback_data: `/finishbuylogin20 ${login} DF` }],
                [{ text: `ES | ${count.ES}`, callback_data: `/finishbuylogin20 ${login} ES` }],
                [{ text: `GO | ${count.GO}`, callback_data: `/finishbuylogin20 ${login} GO` }],
                [{ text: `MA | ${count.MA}`, callback_data: `/finishbuylogin20 ${login} MA` }],
                [{ text: `MG | ${count.MG}`, callback_data: `/finishbuylogin20 ${login} MG` }],
                [{ text: `MT | ${count.MT}`, callback_data: `/finishbuylogin20 ${login} MT` }],
                [{ text: `MS | ${count.MS}`, callback_data: `/finishbuylogin20 ${login} MS` }],
                [{ text: `PA | ${count.PA}`, callback_data: `/finishbuylogin20 ${login} PA` }],
                [{ text: `PB | ${count.PB}`, callback_data: `/finishbuylogin20 ${login} PB` }],
                [{ text: `PR | ${count.PR}`, callback_data: `/finishbuylogin20 ${login} PR` }],
                [{ text: `PE | ${count.PE}`, callback_data: `/finishbuylogin20 ${login} PE` }],
                [{ text: `PI | ${count.PI}`, callback_data: `/finishbuylogin20 ${login} PI` }],
                [{ text: `RO | ${count.RO}`, callback_data: `/finishbuylogin20 ${login} RO` }],
                [{ text: `RJ | ${count.RJ}`, callback_data: `/finishbuylogin20 ${login} RJ` }],
                [{ text: `RR | ${count.RR}`, callback_data: `/finishbuylogin20 ${login} RR` }],
                [{ text: `RN | ${count.RN}`, callback_data: `/finishbuylogin20 ${login} RN` }],
                [{ text: `RS | ${count.RS}`, callback_data: `/finishbuylogin20 ${login} RS` }],
                [{ text: `SC | ${count.SC}`, callback_data: `/finishbuylogin20 ${login} SC` }],
                [{ text: `SE | ${count.SE}`, callback_data: `/finishbuylogin20 ${login} SE` }],
                [{ text: `TO | ${count.TO}`, callback_data: `/finishbuylogin20 ${login} TO` }],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylogin" }]
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    if (command == "/buylogin15") {
        DeleteMSG(ctx)

        const login = args[0]
        const count = await Db.GetCountLogin15(login)


        const msg = `🛍 𝗟𝗢𝗚𝗜𝗡: ${login.replace("_", " ").toUpperCase()} 🛍
├💸| 𝗩𝗔𝗟𝗢𝗥: 15.00
├💰| 𝗦𝗘𝗨 𝗦𝗔𝗟𝗗𝗢: ${user.money}
└📦| 𝗘𝗦𝗧𝗢𝗤𝗨𝗘: ${count.all}
        `
        const menu = {
            inline_keyboard: [
                [{ text: `🛒 𝗖𝗼𝗺𝗽𝗿𝗮𝗿`, callback_data: `/finishbuylogin15 ${login}` }],
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/buylogin" }]
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    if (command == "/finishbuylogin20") {

        const login = args[0]
        const state = args[1]
        const infos = await Db.buyLogin(login, state, ctx.chat.id, ctx)

        if (infos.nomoney) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }
        if (infos.error) return


        DeleteMSG(ctx)


        const msg = `𝗖𝗢𝗠𝗣𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔 ✅

𝗟𝗢𝗚𝗜𝗡 ${login.replace("_", " ").toUpperCase()}

𝗘𝗠𝗔𝗜𝗟: ${infos.email}

𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

Garantia de email batendo e login com compra aprovada.

Garantia do material! 
Não garantimos sua aprovação.

Qualquer tipo de divergencia, Chame o Suporte. @SuporteRycaStore`
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    if (command == "/finishbuylogin15") {

        const login = args[0]
        const infos = await Db.buyLogin15(login, ctx.chat.id, ctx)

        if (infos.nomoney) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }
        if (infos.error) return


        DeleteMSG(ctx)


        const msg = `𝗖𝗢𝗠𝗣𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔 ✅

𝗟𝗢𝗚𝗜𝗡 ${login.replace("_", " ").toUpperCase()}

𝗘𝗠𝗔𝗜𝗟: ${infos.email}

𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

Garantia de email batendo e login com compra aprovada.

Garantia do material! 
Não garantimos sua aprovação.

Qualquer tipo de divergencia, Chame o Suporte. @SuporteRycaStore`
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }


    //#endregion

    //=======================================================
    //                  CONTAS PREMIUM
    //=======================================================

    //#region  Contas Preium

    if (command == "/finishbuyhit") {

        const type = args[0]
        const value = args[1]
        const infos = await Db.buyHit(type, value, ctx.chat.id, ctx)

        if (infos.nomoney) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }
        if (infos.error) return


        DeleteMSG(ctx)


        const msg = `𝗖𝗢𝗠𝗣𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔 ✅

𝗖𝗢𝗡𝗧𝗔: ${type.toUpperCase().replace("_", " ")} 🎊

𝗘𝗠𝗔𝗜𝗟: ${infos.email}

𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

⚠ Garantia apenas de conta Logando!!

❗Não troque email/senha.

Boa diversão 🎉
obrigado pela preferência 🎀

Qualquer coisa, Chame o Suporte. @SuporteRycaStore`
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    if (command == "/finishbuyconta") {

        const type = args[0]
        const value = args[1]
        const time = args[2]
        const infos = await Db.buyConta(type, value, ctx.chat.id, ctx)

        if (infos.nomoney) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }
        if (infos.error) return


        DeleteMSG(ctx)


        const msg = `𝗖𝗢𝗠𝗣𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔 ✅

𝗖𝗢𝗡𝗧𝗔: ${type.toUpperCase().replace("_", " ")} 🎊

𝗘𝗠𝗔𝗜𝗟: ${infos.email}

𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

⚠️ Garantia de ${time ? "3 meses" : "30 dias"} de suporte.

Boa diversão 🎉
obrigado pela preferência 🎀

Qualquer coisa, Chame o Suporte. @SuporteRycaStore`
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })
    }

    if (command == "/finishbuytela") {

        const type = args[0]
        const value = args[1]
        const time = args[2]
        const infos = await Db.buyTela(type, value, ctx.chat.id, ctx)

        if (infos.nomoney) {
            return ctx.reply("Saldo Insuficiente!").then(t => {
                setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
            })

        }
        if (infos.error) return


        DeleteMSG(ctx)


        var msg = `𝗖𝗢𝗠𝗣𝗥𝗔 𝗖𝗢𝗡𝗙𝗜𝗥𝗠𝗔𝗗𝗔 ✅

𝗧𝗘𝗟𝗔 : ${type.toUpperCase().replace("_", " ")} 🎊

𝗘𝗠𝗔𝗜𝗟: ${infos.email}

𝗦𝗘𝗡𝗛𝗔: ${infos.pass}

𝗡𝗨𝗠𝗘𝗥𝗢 𝗗𝗔 𝗧𝗘𝗟𝗔: ${infos.numTela}

${infos.pin ? `𝗣𝗜𝗡: ${infos.pin}` : ""}

⚠️ Garantia de ${time ? "3 meses" : "30 dias"} de suporte.


Boa diversão 🎉
obrigado pela preferência 🎀


Qualquer coisa, Chame o Suporte. @SuporteRycaStore`

        if(infos.link) msg = `✅ <b>COMPRA EFETUADA </b>

<b>🎉 LINK ${type.toUpperCase()} ${type == 'canva' ? "PRO" : "PREMIUM"} </b> 

${infos.link}

Suporte: @SuporteRycaStore`

        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu, parse_mode: "HTML"})
    }

    //#endregion

    //=======================================================
    //                  GIFT CARD
    //=======================================================

    //#region  Sistema Gift 

    if (command == '/finishbuygift') {


        const type = args[0];
        const value = args[1];

        const infos = await Db.buyGiftCard(type, value, ctx.chat.id, ctx);

        if (infos.error) return
        if (infos.nomoney) return ctx.reply("Saldo Insuficiente!").then(t => {
            setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
        })

            DeleteMSG(ctx)


        const msg = `
GIFT CARD ${type.toUpperCase()}

${infos.code}

SALDO: ${infos.value} 

VALOR: ${infos.price} 

Garantia de Saldo Adicionado!

Comprou o Gift? Use o saldo que foi adicionado na sua conta.

Não garantimos saldo guardado para usar depois. Se for pra usar depois compra depois!

Após adicionar o Gift card a sua conta, Envie print para o Suporte. 
@SuporteRycaStore 

att, ryca store
        `
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })

    }

    //#endregion



    //======================================================
    //                NOTAS FAKES
    //================================================

    //#region Sistema notas fakes 

    if (command == '/buynotafake') {


        const type = args[0];
        const quant = args[1];
        const value = +args[2];

        const infos = await Db.BuyNotaFake(type, value, quant, ctx.chat.id, ctx);

        if (infos.error) return
        if (infos.nomoney) return ctx.reply("Saldo Insuficiente!").then(t => {
            setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
        })

            DeleteMSG(ctx)


        const msg = `
✅ 𝗖𝗼𝗺𝗽𝗿𝗮 𝗲𝗳𝗲𝘁𝘂𝗮𝗱𝗮!

${quant}k de Nota Fake ${type} 
    
Para dar prosseguimento na sua compra. Chame o Suporte @SuporteRycaStore para fornecer alguns dados para o envio do seu pedido.
    `
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })

    }

    //#endregion


    //=======================================================
    //                  EDITAVEIS
    //=======================================================

    //#region Editavereis

    if (command == '/finishbuyeditavel') {


        const type = args[1].replaceAll("_", " ");
        const value = +args[0];

        const infos = await Db.BuyEditavel(type, value, ctx.chat.id, ctx);

        if (infos.error) return
        if (infos.nomoney) return ctx.reply("Saldo Insuficiente!").then(t => {
            setTimeout(() => { ctx.deleteMessages([t.message_id]) }, 2000)
        })

            DeleteMSG(ctx)


        const msg = `
✅ 𝗖𝗼𝗺𝗽𝗿𝗮 𝗲𝗳𝗲𝘁𝘂𝗮𝗱𝗮!

${type} 
    
Para dar prosseguimento na sua compra. Chame o Suporte @SuporteRycaStore para fornecer alguns dados para o envio do seu pedido.
    `
        const menu = {
            inline_keyboard: [
                [{ text: "↩️ 𝗩𝗼𝗹𝘁𝗮𝗿", callback_data: "/start" }],
            ]
        }

        ctx.reply(msg, { reply_markup: menu })

    }

    //#endregion


    //#endregion

})

bot.launch(() => {
    console.log("bot on");
})

module.exports = {
    bot: bot
}

// #region text
// const dasd  =´├ ID: 6141024093
// ├💰 Saldo: R$ 0,00
// └💎 Pontos: 0,00 (~R$0,00)

// 💳 Unitária

// 🏦 Pesquisar banco

// 🔐 Pesquisar bin

// 🏳️ Pesquisa bandeira

// 🔰 Pesquisar level

// 🌎 Pesquisar país

// ⬅️ 𝗩𝗼𝗹𝘁𝗮𝗿
// ´
// #endregion