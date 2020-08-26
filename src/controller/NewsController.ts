import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Place } from "../entity/Place";
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { Promotion } from '../entity/Promotion';
import { News } from '../entity/News';

export class NewsController extends BaseController<News> {

    private _professionalsRepository = getRepository(Professional)
    private _servicesRepository = getRepository(Service)
    private _promotionsRepository = getRepository(Promotion)

    constructor() {
        super(News, true);
    }

    async save(request: Request) {
        let _news = <News>request.body;
        super.isRequired(_news.name, 'O nome é obrigatório');
        return super.save(_news, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

}