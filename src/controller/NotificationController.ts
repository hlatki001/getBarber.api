import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Place } from "../entity/Place";
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { Promotion } from '../entity/Promotion';
import { Notification } from '../entity/Notification';

export class NotificationController extends BaseController<Notification> {

    private _professionalsRepository = getRepository(Professional)
    private _servicesRepository = getRepository(Service)
    private _promotionsRepository = getRepository(Promotion)

    constructor() {
        super(Notification, true);
    }

    async save(request: Request) {
        let _notification = <Notification>request.body;
        return super.save(_notification, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }


}