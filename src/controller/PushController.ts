import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Place } from "../entity/Place";
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { Promotion } from '../entity/Promotion';
import { News } from '../entity/News';
import { Push } from '../entity/Push';
import { User } from '../entity/User';

export class PushController extends BaseController<Push> {

    private _userRepository = getRepository(User);

    constructor() {
        super(Push, true);
    }

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


    async save(request: Request) {
        let _push = <Push>request.body;


        var userList = request.body.user_list
        var mailList = []
        var uList = {
            userList: userList.replace(/,$/, "").split(",").map(function (user) {
                return { user: user };
            })
        };

        for (let index = 0; index < uList.userList.length; index++) {

            const user = uList.userList[index].user

            const usuario = await this._userRepository.findOne({ uid: user });
            mailList.push(usuario.email)
        }

        console.log(request.body)

        const { v4: uuidv4 } = require('uuid');
        const paushUid = uuidv4();

        let namePush
        let urlPush
        if (_push.category == '0') {
            namePush = 'Notícia';
            urlPush = 'noticias';
        }
        else {
            namePush = 'Promoções';
            urlPush = 'promocoes';
        }

        var message = {
            app_id: 'b25de091-99ba-4746-b489-b8ee22d5ce1f',
            included_segments: ['All'],
            data: { 'task': urlPush, 'title': _push.title, 'link': namePush },
            contents: { 'en': _push.contents },
            title: _push.title,
            email: mailList
        };

        _push.pushId = paushUid

        console.log(message)

        this.sendNotification(message);


        return super.save(_push, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

}