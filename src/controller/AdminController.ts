import { Request } from 'express';
import { User } from "../entity/User";
import { BaseController } from "./BaseController";
import { sign } from 'jsonwebtoken';
import config from "../configuration/config";
import * as md5 from 'md5';
import { FileHelper } from '../helpers/fileHelper';
import { Agenda } from '../entity/Agenda';
import { getRepository } from 'typeorm';
import { Points } from '../entity/Points';
import { Notification } from '../entity/Notification';
import { Admin } from '../entity/Admin';
import { ServiceProvider } from '../entity/ServiceProvider';
import { News } from '../entity/News';
import { Promotion } from '../entity/Promotion';
import { Plans } from '../entity/Plans';


export class AdminController extends BaseController<Admin> {


    constructor() {
        super(Admin, true);
    }

    async auth(request: Request) {

        let { email, password } = request.body;

        if (!email || !password)
            return { status: 400, message: 'Informe o email e a senha para efetuar o login' };

        let user = await this.repository.findOne({ email: email, password: md5(password) });
        if (user) {
            let _payload = {
                uid: user.uid,
                name: user.name,
                email: user.email,
                origin: 'Admin'
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

    async changePassword(request: Request) {

        const userId = request.userAuth.uid;
        const userEmail = request.userAuth.email;
        const { currentPassword, newPassword, confirmNewPassword } = request.body;

        this.isRequired(currentPassword, 'A senha atual é obrigatória');
        this.isRequired(newPassword, 'A nova senha é obrigatória');
        this.isRequired(confirmNewPassword, 'A confirmação da nova senha é obrigatória');
        this.isTrue(newPassword !== confirmNewPassword, 'A senha e a confirmação de senha não são iguais');

        if (!this.valid())
            return {
                status: 400,
                errors: this.allNotifications
            }

        let checkEmail = await this.repository.findOne({ email: userEmail });
        if (checkEmail)
            return { status: 400, errors: ['Já existe um cadastro com esse email.'] }


        const user = await this.repository.findOne({ where: { uid: userId } });
        if (user) {

            if (user.password !== md5(currentPassword))
                return { status: 400, errors: ['A senha atual não confere.'] }

            user.password = md5(newPassword);
            this.repository.save(user);
        } else
            return { status: 404, message: 'Usuario não encontrado' };
    }

    private _clients = getRepository(ServiceProvider);
    private _user = getRepository(User);
    private _news = getRepository(News);
    private _promotions = getRepository(Promotion);
    private _plans = getRepository(Plans);


    async allClients(request: Request) {
        return this._clients.find({
            deleted: false
        })
    }

    async allUsers(request: Request) {
        return this._user.find({
            where: {
                deleted: false
            }
        })
    }

    async allNews(request: Request) {
        return this._news.find({
            where: {
                deleted: false
            }
        })
    }

    async allPromotions(request: Request) {
        return this._promotions.find({
            where: {
                deleted: false
            }
        })
    }

    async allPlans(request: Request) {
        return this._plans.find({
            where: {
                deleted: false,
                test: 0
            }
        })
    }




}