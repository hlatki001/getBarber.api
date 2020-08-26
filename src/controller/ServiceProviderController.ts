import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Place } from "../entity/Place";
import { sign } from 'jsonwebtoken';
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { ServiceProvider } from '../entity/ServiceProvider';
import { FileHelper } from '../helpers/fileHelper';
import * as md5 from 'md5';
import config from "../configuration/config";
import { User } from '../entity/User';
import { Agenda } from '../entity/Agenda';
import { Promotion } from '../entity/Promotion';
import { News } from '../entity/News';
import { Category } from '../entity/Category';
import { Products } from '../entity/Products';
import { Push } from '../entity/Push';
import { Notification } from '../entity/Notification';
import { Sale } from '../entity/Sales';
import { Plans } from '../entity/Plans';
import { stringify } from 'querystring';


export class ServiceProviderController extends BaseController<ServiceProvider> {

    private _requestUsers = getRepository(User);
    private _requestPlaces = getRepository(Place);
    private _requestProfessionals = getRepository(Professional);
    private _requestServices = getRepository(Service);
    private _requestPromotions = getRepository(Promotion);
    private _requestCategories = getRepository(Category);
    private _requestProducts = getRepository(Products);
    private _requestPushs = getRepository(Push);
    private _notificationRepository = getRepository(Notification);
    private _saleRepository = getRepository(Sale);


    private _requestNews = getRepository(News)
    private _requestSale = getRepository(Sale)
    private _requestPlan = getRepository(Plans)

    constructor() {
        super(ServiceProvider, true);
    }

    async save(request: Request) {
        let _serviceProvider = <ServiceProvider>request.body;

        if (_serviceProvider.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_serviceProvider.photo)
            if (pictureCreatedResult)
                _serviceProvider.photo = pictureCreatedResult
        }

        const planCheck = await this._requestPlan.findOne({ active: true, test: true })

        _serviceProvider.plan = planCheck
        _serviceProvider.planStartDate = new Date();
        _serviceProvider.planFinishDate = new Date(new Date().setDate(new Date().getDate() + 7));


        return super.save(_serviceProvider, request);
    }

    async auth(request: Request) {

        let { email, password } = request.body;
        if (!email || !password)
            return { status: 400, message: 'Informe o email e a senha para efetuar o login' };

        let user = await this.repository.findOne({ email: email, password: md5(password) });
        console.log(user)

        if (user) {

            if (user.planFinishDate < new Date() || user.planFinishDate == null) {

                const SP = await this.repository.save({
                    uid: user.uid,
                    planActive: false
                })

            }
            else {
                console.log('tem plano ativo até: ', user.planFinishDate)
                const SP = await this.repository.save({
                    uid: user.uid,
                    planActive: true
                })

            }
            if (user.active == false) {
                return { status: 400, message: 'Sua conta está inativa, por favor cheque sua assinatura ou entre em contato com o administrador.' };

            }

        }
        if (user) {
            let _payload = {
                uid: user.uid,
                name: user.name,
                photo: user.photo,
                email: user.email,
                origin: 'ServiceProvider'
            }
            return {
                status: 200,
                message: {
                    user: _payload,
                    token: sign({
                        ..._payload,
                        tm: new Date().getTime()
                    }, config.secretyKey)
                }
            }
        } else
            return { status: 404, message: 'E-mail ou senha inválidos' }
    }



    async createServiceProvider(request: Request) {

        let { name, photo, idCode, email, phone, rua, cidade, estado, cep, numero, bairro, isRoot, password, confirmPassword, role, vip, vipDate, plan = 'f03dc575-8731-4901-aee3-879c010910b2' } = request.body;
        super.isRequired(name, 'Informe o nome');
        super.isRequired(email, 'Informe o e-mail');
        super.isRequired(idCode, 'Informe seu CPF ou CNPJ.');
        super.isRequired(phone, 'Informe o telefone');
        super.isRequired(password, 'Informe a senha');
        super.isRequired(confirmPassword, 'Informe a confirmação da senha');
        super.isRequired(rua, 'Informe a rua');
        super.isRequired(cidade, 'Informe a cidade');
        super.isRequired(estado, 'Informe o Estado');
        super.isRequired(cep, 'Informe o cep');
        super.isRequired(numero, 'Informe o número');
        super.isRequired(bairro, 'Informe o bairro');




        let _serviceProviver = new ServiceProvider();
        _serviceProviver.name = name;
        _serviceProviver.idCode = idCode;
        _serviceProviver.email = email;
        _serviceProviver.phone = phone;
        _serviceProviver.rua = rua;
        _serviceProviver.cidade = cidade;
        _serviceProviver.estado = estado;
        _serviceProviver.cep = cep;
        _serviceProviver.numero = numero;
        _serviceProviver.bairro = bairro;

        const planCheck = await this._requestPlan.findOne({ active: true, test: true })

        _serviceProviver.plan = planCheck
        _serviceProviver.planStartDate = new Date();
        _serviceProviver.planFinishDate = new Date(new Date().setDate(new Date().getDate() + 7));
        _serviceProviver.planActive = true


        let checkEmail = await this.repository.findOne({ email: email });
        if (checkEmail)
            return { status: 400, errors: ['Já existe um cadastro com esse email.'] }

        if (photo) {
            let pictureCreatedResult = await FileHelper.writePicture(photo)
            if (pictureCreatedResult)
                _serviceProviver.photo = pictureCreatedResult
        }

        if (password != confirmPassword)
            return { status: 400, errors: ['A senha e a confirmação são diferente'] }

        if (password)
            _serviceProviver.password = md5(password);

        _serviceProviver.role = 1;
        _serviceProviver.isRoot = isRoot;


        return super.save(_serviceProviver, request, true);
    }





    async all(request: Request) {
        return this.repository.find({
            select: ['name', 'photo', 'email', 'rua', 'numero', 'bairro', 'cidade', 'cep', 'estado', 'phone'],
            where: {
                deleted: false
            }
        });
    }

    async getAllTransactions(request: Request) {
        const { id: placeUid } = request.params;
        return this._saleRepository.find({
            where: {
                serviceProvider: placeUid,
                deleted: false
            }
        })
    }

    async getAllUsersPerPlace(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestUsers.find({
            where: {
                serviceProvider: placeUid,
                deleted: false
            }
        })
    }

    async getAllPlaces(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestPlaces.find({
            where: {
                serviceProvider: placeUid,
                deleted: false
            }
        })
    }

    async getAllProfessionals(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestProfessionals.find({
            where: {
                serviceProvider: placeUid,
                deleted: false
            }
        })
    }

    async getAllServices(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestServices.find({
            where: {
                serviceProvider: placeUid,
                deleted: false
            }
        })
    }

    async getAllPromotions(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestPromotions.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllNews(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestNews.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllCategories(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestCategories.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllProducts(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestProducts.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllProductsPromotion(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestProducts.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true,
                isPromotion: 1
            }
        })
    }


    async getAllPushs(request: Request) {
        const { id: placeUid } = request.params;
        return this._requestPushs.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllNotifications(request: Request) {
        const { id: placeUid } = request.params;
        return this._notificationRepository.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true
            }
        })
    }

    async getAllNotificationsReaden(request: Request) {
        const { id: placeUid } = request.params;
        return this._notificationRepository.find({
            where: {
                serviceProvider: placeUid,
                deleted: false,
                active: true,
                isReaden: false
            }
        })
    }

    async getPlacesPerCity(request: Request) {
        const { id: cidade } = request.params;

        return this.repository.find({
            where: {
                cidade: cidade,
                deleted: false,
                active: true
            }
        })
    }




    async getCount(request: Request) {
        const { id: serviceProvider } = request.params;

        const agenda = getRepository(Agenda)
        const user = getRepository(User)
        const promotion = getRepository(Promotion)


        const agendaCount = await agenda.count({
            where: {
                serviceProvider: serviceProvider,
                active: true,
                deleted: false,
                statusAtendimento: 0

            }
        });
        const userCount = await user.count({
            where: {
                serviceProvider: serviceProvider,
                active: true,
                deleted: false
            }
        });

        const promotionCount = await promotion.count({
            where: {
                serviceProvider: serviceProvider,
                active: true,
                deleted: false
            }
        });

        const result = [{ "agendas": agendaCount, "users": userCount, "promotions": promotionCount }]


        return result

    }

}