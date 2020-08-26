import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Service } from "../entity/Service";
import { FileHelper } from '../helpers/fileHelper';

export class ServiceController extends BaseController<Service> {


    constructor() {
        super(Service, true);
    }

    async save(request: Request) {
        let _service = <Service>request.body;
        super.isRequired(_service.name, 'O nome do serviço é obrigatório');
        super.isRequired(_service.price, 'O preço do serviço é obrigatório');
        super.isRequired(_service.description, 'A descrição do serviço é obrigatória');
        super.isRequired(_service.place, 'A filial do serviço é obrigatória')

        if (_service.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_service.photo)
            if (pictureCreatedResult)
                _service.photo = pictureCreatedResult
        }
        return super.save(_service, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

    async getAllServicesPerPlace(request: Request) {
        const { idPlace } = request.params;
        return this.repository.find({
            where: {
                placeUid: idPlace,
                active: true,
                deleted: false
            }
        });
    }

    async getPrice(request: Request) {
        const { id } = request.params;
        return this.repository.find({
            select: ['price', 'points'],
            where: {
                uid: id,
                active: true,
                deleted: false
            }
        });
    }

}