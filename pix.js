const MP = require('mercadopago')
const infosMp = require("./MercadoPagoConfig.json")
// const uniqid = require('uniqid');
const uniqid = require("uniqid")

const checkCob = async (id) => {
    const client = new MP.MercadoPagoConfig({ accessToken: infosMp.accessToken, options: { timeout: 5000, idempotencyKey: 'abc' } })

    const payment = new MP.Payment(client);

    const arr = await payment.search(id)

    const info = arr.results.filter(r => r.id == id)

    return info[0]
}

// checkCob("78053570074").then(console.log.:)

const newCob = async (value) => {
    const client = new MP.MercadoPagoConfig({ accessToken: infosMp.accessToken, options: { timeout: 5000 } })

    const payment = new MP.Payment(client);

    const body = {
        transaction_amount: value,
        description: `produto ${uniqid()}`,
        payment_method_id: 'pix',
        payer: {
            'email': `juasddasdaw@gmail.com`
        },
    };

    const requestOptions = {
        // idempotencyKey: infosMp.publicKey,
    };

    const response = await payment.create({ body });

    payment.search()

    return {
        idCob: response.id,
        codPix: response.point_of_interaction.transaction_data.qr_code,
        value: response.transaction_amount,
        status: "Pendente"
    }
}

// newCob(15).then(console.log)

module.exports = {
    newCob,
    checkCob
}