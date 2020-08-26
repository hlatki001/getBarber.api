import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Service } from "../entity/Service";
import { FileHelper } from '../helpers/fileHelper';
import { Promotion } from '../entity/Promotion';

export class PromotionController extends BaseController<Promotion> {


    constructor() {
        super(Promotion, true);
    }

    async save(request: Request) {
        let _promotion = <Promotion>request.body;
        super.isRequired(_promotion.name, 'O nome da promoção é obrigatório');
        super.isRequired(_promotion.finishDate, 'A data final da promoção é obrigatória');
        super.isRequired(_promotion.finishDate, 'A data inicial da promoção é obrigatória');
        super.isRequired(_promotion.description, 'A descrição da promoção é obrigatória');
        super.isRequired(_promotion.place, 'A filial da promoção é obrigatória')

        if (_promotion.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_promotion.photo)
            if (pictureCreatedResult)
            _promotion.photo = pictureCreatedResult
        }
        return super.save(_promotion, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

}