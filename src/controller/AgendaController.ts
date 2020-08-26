import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Agenda } from "../entity/Agenda";
import { User } from '../entity/User';
import { Professional } from '../entity/Professional';
import { Place } from '../entity/Place';
import { Points } from '../entity/Points';
import { time } from 'console';
import { Notification } from '../entity/Notification';

export class AgendaController extends BaseController<Agenda> {

    private _userRepository = getRepository(User);
    private _placeRepository = getRepository(Place);
    private _notificationRepository = getRepository(Notification);


    constructor() {
        super(Agenda, true);
    }

    async save(request: Request) {
        let _agenda = <Agenda>request.body;

        super.isRequired(_agenda.price, 'O preço obrigatório');
        super.isRequired(_agenda.dia, 'O dia é obrigatório');
        super.isRequired(_agenda.horario, 'O horário é obrigatório');
        super.isRequired(_agenda.place, 'A filial é obrigatória');
        super.isRequired(_agenda.service, 'O serviço é obrigatório');
        super.isRequired(_agenda.user, 'O usuário é obrigatório');
        super.isRequired(_agenda.professional, 'O profissional é obrigatório');


        const usuario = await this._userRepository.findOne({ uid: request.body.user });

        const notificacao = await this._notificationRepository.save({
            name: 'Novo Agendamento',
            description: `${usuario.name} acabou de agendar dia ${_agenda.dia} às ${_agenda.horario}!`,
            serviceProvider: usuario.serviceProvider
        })


        const { v4: uuidv4 } = require('uuid');
        const paushUid = uuidv4();

        const moment = require('moment-timezone');

        const diaOk = moment(_agenda.dia).format('YYYY-MM-DD')
        const horaOk = _agenda.horario + ":00"
        moment.locale('pt-br');


        const timeOk = diaOk + ' ' + horaOk

        var day = moment.tz(timeOk, "America/Sao_Paulo").format('YYYY-MM-DD');
        var hour = moment.tz(timeOk, "America/Sao_Paulo").subtract(30, 'minutes');

        var hOk = hour.hour() + ":" + hour.minutes() + ":00"
        var dataok = day + " " + hOk + " GMT-0300"


        var message = {
            app_id: "b25de091-99ba-4746-b489-b8ee22d5ce1f",
            included_segments: ["All"],
            data: { "task": "agenda", "title": "Agendamento", "link": "Agenda" },
            contents: { "en": "Seu agendamento começará em 30 minutos!" },
            title: "Vamos cortar a cabeleira?",
            email: usuario.email,
            send_after: dataok
        };

        _agenda.pushId = paushUid

        this.sendNotification(message);

        return super.save(_agenda, request);
    }

    async getHorarios(request: Request) {
        const { dia: dia, prof: prof } = request.params;
        return this.repository.find({
            where: {
                dia: dia,
                professional: prof
            }
        });

    }

    //envia o push agendado para o OneSignal
    async sendNotification(data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic MDQzZGViYWMtNDA4Ni00MGEzLTk1ODEtMDcxODQyNGI3ODlk"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        req.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    };

    async createAgenda(request: Request) {

        let { price, points, dia, horario, place, service, user, professional, serviceProvider } = request.body[0];
        super.isRequired(price, 'O preço obrigatório');
        super.isRequired(dia, 'O dia é obrigatório');
        super.isRequired(horario, 'O horário é obrigatório');
        super.isRequired(place, 'A filial é obrigatória');
        super.isRequired(service, 'O serviço é obrigatório');
        super.isRequired(user, 'O usuário é obrigatório');
        super.isRequired(professional, 'O profissional é obrigatório');



        const usuario = await this._userRepository.findOne({ uid: user });
        

        const notificacao = await this._notificationRepository.save({
            name: 'Novo Agendamento',
            description: `${usuario.name} acabou de agendar dia ${dia} às ${horario}!`,
            serviceProvider: usuario.serviceProvider
        })




        const { v4: uuidv4 } = require('uuid');
        const paushUid = uuidv4();

        const moment = require('moment-timezone');

        const diaOk = moment(dia).format('YYYY-MM-DD')
        const horaOk = horario + ":00"
        moment.locale('pt-br');


        const timeOk = diaOk + ' ' + horaOk

        var day = moment.tz(timeOk, "America/Sao_Paulo").format('YYYY-MM-DD');
        var hour = moment.tz(timeOk, "America/Sao_Paulo").subtract(30, 'minutes');

        var hOk = hour.hour() + ":" + hour.minutes() + ":00"
        var dataok = day + " " + hOk + " GMT-0300"


        var message = {
            app_id: "b25de091-99ba-4746-b489-b8ee22d5ce1f",
            included_segments: ["All"],
            data: { "task": "agenda", "title": "Agendamento", "link": "Agenda" },
            contents: { "en": "Seu agendamento começará em 30 minutos!" },
            title: "Vamos cortar a cabeleira?",
            email: usuario.email,
            send_after: dataok
        };


        this.sendNotification(message);


        let _agenda = new Agenda();
        _agenda.price = price;
        _agenda.points = points;
        _agenda.dia = dia;
        _agenda.horario = horario;
        _agenda.place = place;
        _agenda.service = service;
        _agenda.professional = professional;
        _agenda.user = user;
        _agenda.pushId = paushUid;
        _agenda.serviceProvider = serviceProvider;


        return super.save(_agenda, request, true);
    }


    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

    async getHorariosPlace(request: Request) {
        const { id: placeUid } = request.params;
        return this.repository.find({
            where: {
                place: placeUid,
                deleted: false
            }
        })
    }

    async getHorariosServiceProvider(request: Request) {
        const { id: serviceProviderUid } = request.params;
        return this.repository.find({
            where: {
                serviceProvider: serviceProviderUid,
                deleted: false
            }
        })
    }

}