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


export class UserController extends BaseController<User> {

    private _requestAgendas = getRepository(Agenda);
    private _requestPoints = getRepository(Points);

    constructor() {
        super(User);
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
                photo: user.photo,
                email: user.email,
                origin: 'User'
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

    async authSocial(request: Request) {

        let body = request.body;

        let user = await this.repository.findOne({ email: body.email, fbId: body.id });
        if (user) {
            let _payload = {
                uid: user.uid,
                name: user.name,
                photo: user.photo,
                email: user.email,
                origin: 'User'
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
        } else {
            let _user = request.body;

            let _newUser = new User();

            const foto = _user.picture.data.url

            _newUser.name = _user.name;
            _newUser.email = _user.email;
            _newUser.fbId = _user.id;
            _newUser.password = "facebookUser";
            _newUser.photo = _user.id + ".jpg";
            _user.isRoot = 0;

            var req = require("request");

            var fs = require("fs");

            req(foto).pipe(fs.createWriteStream("./storage/" + _user.id + ".jpg"))
                .on('close', function () {
                });
            super.save(_newUser, request, true);
        }
    }

    async forgotPassword(request: Request) {

        let body = request.body;

        const user = await this.repository.findOne({ email: body.email });
        if (user) {
            if (user.password == "facebookUser") {
                return { status: 404, message: 'Email não encontrado ou seu cadastro foi feito com o facebook' };
            }

            const newPwd = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user.password = md5(newPwd);

            console.log(body.email)

            const mailjet = require('node-mailjet')
                .connect('741799245a8ddafc0d9ae4e2989d9a72', 'd71c35137118a88cebc6a234eee1c4ed')
            const request = mailjet
                .post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [
                        {
                            "From": {
                                "Email": "getbarber@dotsolucoes.com.br",
                                "Name": "getBarber - Recuperação de Senha"
                            },
                            "To": [
                                {
                                    "Email": body.email,
                                    "Name": user.name
                                }
                            ],
                            "Subject": "getBarber",
                            "TextPart": "Recuperação de Senha",
                            "HTMLPart": "<h3>Prezado, " + user.name + ". Este é um email de recuperação de senha, sua nova senha para acessar o aplicativo é: " + newPwd + ".</h3><br />May the shaving force be with you!",
                        }
                    ]
                })
            request
                .then((result) => {
                    console.log(result.body)
                })
                .catch((err) => {
                    console.log(err.statusCode)
                })



            return this.repository.save(user);

        }
        else {
            return { status: 404, message: 'Email não encontrado' };
        }

    }




    async createUser(request: Request) {

        let { name, photo, email, phone, birth, cpf, points, password, confirmPassword, isRoot, rua, cidade, estado, cep, bairro, numero, serviceProvider } = request.body;
        super.isRequired(name, 'Informe o nome');
        super.isRequired(email, 'Informe o e-mail');
        super.isRequired(birth, 'Informe sua Data de Nascimento');
        super.isRequired(cpf, 'Informe seu CPF');
        super.isRequired(phone, 'Informe o telefone');
        super.isRequired(password, 'Informe a senha');
        super.isRequired(confirmPassword, 'Informe a confirmação da senha');
        super.isRequired(rua, 'Informe a rua');
        super.isRequired(cidade, 'Informe a cidade');
        super.isRequired(estado, 'Informe o Estado');
        super.isRequired(cep, 'Informe o cep');
        super.isRequired(numero, 'Informe o número');

        let _user = new User();
        _user.name = name;
        _user.photo = photo;
        _user.email = email;
        _user.phone = phone;
        _user.cpf = cpf;
        _user.birth = birth;
        _user.rua = rua;
        _user.cidade = cidade;
        _user.estado = estado;
        _user.cep = cep;
        _user.numero = numero;
        _user.bairro = bairro;
        _user.serviceProvider = serviceProvider;


        let checkEmail = await this.repository.findOne({ email: email });
        if (checkEmail)
            return { status: 400, errors: ['Já existe um cadastro com esse email.'] }

        if (_user.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_user.photo)
            if (pictureCreatedResult)
                _user.photo = pictureCreatedResult
        }

        if (password != confirmPassword)
            return { status: 400, errors: ['A senha e a confirmação são diferente'] }

        if (password)
            _user.password = md5(password);

        _user.isRoot = isRoot;

        return super.save(_user, request, true);
    }

    private _notificationRepository = getRepository(Notification);

    async save(request: Request) {
        let _user = <User>request.body;
        super.isRequired(_user.name, 'O nome do usuário é obrigatório');

        if (_user.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_user.photo)
            if (pictureCreatedResult)
                _user.photo = pictureCreatedResult
        }

        const notificacao = await this._notificationRepository.save({
            name: 'Nova Cadastro',
            description: `${_user.name} acabou de se cadastrar!`,
            serviceProvider: _user.serviceProvider
        })


        return super.save(_user, request);
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

    async getMyAgendas(request: Request) {
        const { id: userId } = request.params;
        return this._requestAgendas.find({
            where: {
                user: userId,
                deleted: false,
                statusAtendimento: 0
            }
        })
    }

    async getMyFinishedAgendas(request: Request) {
        const { id: userId } = request.params;
        return this._requestAgendas.find({
            where: {
                user: userId,
                deleted: false,
                statusAtendimento: 1
            }
        })
    }

    async getMyNonFinishedAgendas(request: Request) {
        const { id: userId } = request.params;
        return this._requestAgendas.find({
            where: {
                user: userId,
                deleted: false,
                statusAtendimento: 0
            }
        })
    }

    async pointsPerUser(request: Request) {
        const { id: userId, sUid: serviceProviderUid } = request.params;
        return this._requestPoints.find({
            where: {
                user: userId,
                serviceProvider: serviceProviderUid,
                deleted: false
            }
        })
    }

}