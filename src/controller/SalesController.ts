import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Sale } from '../entity/Sales';
import { ServiceProvider } from '../entity/ServiceProvider';

const pagseguro = require('../shared/pagseguro/src')

const config = require('../shared/pagseguro/config.js')

var PagSeguro = require('node-pagseguro2');

var payment = new PagSeguro({
    email: "luis.hlatki@hotmail.com", // email da conta do pagseguro
    token: "e2cd44e3-a799-4e76-8515-b8f956b6e04e69fbc94a4e94a3e66fcdc81e38d0a2e40e3d-f1cd-4bff-8952-20c935ee7487", // token pagseguro
    sandbox: 0,
    sandbox_email: 'v89475634178158443153@sandbox.pagseguro.com.br'
})

var teste


var pagseguroData = {
    email: "luis.hlatki@hotmail.com", // email da conta do pagseguro
    token: "e2cd44e3-a799-4e76-8515-b8f956b6e04e69fbc94a4e94a3e66fcdc81e38d0a2e40e3d-f1cd-4bff-8952-20c935ee7487", // token pagseguro
}



export class SalesController extends BaseController<Sale> {


    private _repServiceProvider = getRepository(ServiceProvider);
    private test


    constructor() {
        super(Sale, true);
    }

    async getSessionId(request: Request) {
        const axios = require('axios')
        const exec = await axios.post(`https://ws.pagseguro.uol.com.br/v2/sessions?email=${pagseguroData.email}&token=${pagseguroData.token}`)
        var xml2js = require('xml2js');
        const parsedXml = await xml2js.parseStringPromise(exec.data)

        return parsedXml.session.id[0]
    }



    async processData(request: Request) {
        let _sale = <Sale>request.body;


        const serviceProvider = await this._repServiceProvider.findOne({ uid: request.body.serviceProvider })
        if (!serviceProvider) {
            return { status: 400, message: 'Usuário não encontrado' };

        }
        payment.sessionId(function (err, session_id) {
        });


        payment.setSender({
            name: request.body.userName,
            email: serviceProvider.email,
            cpf_cnpj: request.body.userCPF,
            area_code: request.body.userArea,
            phone: request.body.userPhone,
            birth_date: request.body.userBirth //formato dd/mm/yyyy
        })

        payment.setShipping({
            street: serviceProvider.rua,
            number: serviceProvider.numero,
            district: serviceProvider.bairro,
            city: serviceProvider.cidade,
            state: serviceProvider.estado,
            postal_code: serviceProvider.cep,
            same_for_billing: true, //opcional, informar se o endereço de entrega for o mesmo do endereço de cobrança
            shippingAddressRequired: false
        })

        console.log('passei aqui')
        var res2 = []
        var res = await this.processDataTeste(_sale, request)

        res2.push(res)

        console.log('resultado', res2[0].length)

        if (res2[0].length != undefined) {
            for (let index = 0; index < res2[0].length; index++) {
                return { status: 400, message: res2[0][index].message };

            }

        }

        if (request.body.typePgto == "0") {
            _sale.paymentLink = res2[0].paymentLink

        }
        else {
            _sale.paymentLink = 'Cartão de Crédito'
        }


        if (res2[0].code && res2[0].code.length == 5) {
            return { status: 400, message: res2[0].message };

        }

        _sale.transactionId = res2[0].code
        _sale.status = 0


        return super.save(_sale, request);

    }

    public processDataTeste(_sale, request) {
        console.log('cheguei na outra função')

        return new Promise(function (resolve, reject) {

            if (request.body.typePgto == '0') {
                console.log('selecionou boleto')

                payment.addItem({
                    qtde: 1,
                    value: request.body.totalPrice,
                    description: _sale.title
                })

                payment.sendTransaction({
                    method: 'boleto', //'boleto' ou 'creditCard'
                    //credit_card_token: request.body.cardToken, //token do cartão de crédito
                    value: request.body.totalPrice,
                    installments: 1, //opcional, padrão 1
                    extra_amount: 0, //opcional, padrão 0
                    reference: '', //opcional, padrão vazio - string identificadora do pedido
                    hash: request.body.hash,          //senderHash gerado pela biblioteca do PagSeguro
                    noInterestInstallmentQuantity: 1 //opcional, nº de parcelas s/ juros oferecido ao pagador (juros serão cobrados ao vendedor)
                }, function (err, data) {
                    if (err) {
                        for (let index = 0; index < err.length; index++) {
                            err[index].status = 1

                        }
                        resolve(err)
                    }
                    else {
                        resolve(data)
                    }
                })
            }
            else {
                payment.addItem({
                    qtde: 1,
                    value: request.body.totalPrice,
                    description: _sale.title
                })

                payment.setCreditCardHolder({
                    name: request.body.userName,
                    cpf_cnpj: request.body.userCPF,
                    area_code: request.body.userArea,
                    phone: request.body.userPhone,
                    birth_date: request.body.userBirth //formato dd/mm/yyyy
                })

                console.log('selecionou cartao')
                payment.sendTransaction({
                    method: 'creditCard', //'boleto' ou 'creditCard'
                    credit_card_token: request.body.cardToken, //token do cartão de crédito
                    value: request.body.totalPrice,
                    installments: request.body.parcel, //opcional, padrão 1
                    extra_amount: 0, //opcional, padrão 0
                    reference: '', //opcional, padrão vazio - string identificadora do pedido
                    hash: request.body.hash,          //senderHash gerado pela biblioteca do PagSeguro
                    noInterestInstallmentQuantity: request.body.parcel //opcional, nº de parcelas s/ juros oferecido ao pagador (juros serão cobrados ao vendedor)
                }, function (err, data) {
                    if (err) {
                        console.log(err)
                        resolve(err)
                    }
                    else {
                        resolve(data)
                    }
                })


            }
        })
    }

    async checkTransaction(request: Request) {
        console.log('chegou aqui')
        let id = request.body.notificationCode

        const axios = require('axios')
        const exec = await axios.get(`https://ws.pagseguro.uol.com.br/v2/transactions/notifications/${id}?email=${pagseguroData.email}&token=${pagseguroData.token}`)

        var xml2js = require('xml2js');
        const parsedXml = await xml2js.parseStringPromise(exec.data)

        let status = parsedXml.transaction.status[0]
        let code = parsedXml.transaction.code[0]

        console.log(parsedXml)


        const sale = await this.repository.findOne({ transactionId: code })
        if (!sale) {
            return { status: 400, message: 'Venda não encontrado' };

        }

        console.log(sale.plan.uid)


        const sProvider = await this._repServiceProvider.findOne({ uid: sale.serviceProvider.uid })
        if (!sProvider) {
            return { status: 400, message: 'Usuário não encontrado' };

        }
        console.log(sProvider)
        console.log('teste', status)


        if (status != 3) {

            const SP = await this._repServiceProvider.save({
                uid: sProvider.uid,
                plan: sale.plan,
                planActive: false

            })

            const venda = this.repository.save({
                uid: sale.uid,
                status: status
            })

        }
        else {
            console.log('paguei', sProvider)
            var dateFinish;
            if (sale.plan.peridiocity == 0) {
                dateFinish = 1
            }
            if (sale.plan.peridiocity == 1) {
                dateFinish = 90

            }
            if (sale.plan.peridiocity == 2) {
                dateFinish = 180
            }
            if (sale.plan.peridiocity == 3) {
                dateFinish = 365
            }

            const SP = await this._repServiceProvider.save({
                uid: sProvider.uid,
                plan: sale.plan,
                planStartDate: new Date(),
                planFinishDate: new Date(new Date().setDate(new Date().getDate() + dateFinish)),
                planActive: true

            })

            const venda = this.repository.save({
                uid: sale.uid,
                status: status
            })

        }

        return 'sucesso'




    }


    async save(request: Request) {

        let _sale = <Sale>request.body;


        const serviceProvider = await this._repServiceProvider.findOne({ uid: request.body.serviceProvider })
        if (!serviceProvider) {
            return { status: 400, message: 'Usuário não encontrado' };

        }


        if (request.body.typePgto == '0') {
            console.log('selecionou boleto')


            var dateFinish;


            if (request.body.peridiocity == 0) {
                dateFinish = 1
            }
            if (request.body.peridiocity == 1) {
                dateFinish = 90

            }
            if (request.body.peridiocity == 2) {
                dateFinish = 180
            }
            if (request.body.peridiocity == 3) {
                dateFinish = 365

            }


            const SP = await this._repServiceProvider.save({
                uid: serviceProvider.uid,
                plan: _sale.plan,
                planStartDate: new Date(),
                planFinishDate: new Date(new Date().setDate(new Date().getDate() + dateFinish)),
                planActive: true

            })
        }
        else {
            console.log('selecionou cartão')


        }

        return super.save(_sale, request);
    }

    async checkStatus(cd) {

    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

}