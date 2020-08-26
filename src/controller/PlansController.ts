import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Professional } from "../entity/Professional";
import { FileHelper } from '../helpers/fileHelper';
import { Plans } from '../entity/Plans';

export class PlansController extends BaseController<Plans> {


    constructor() {
        super(Plans, true);
    }

    async save(request: Request) {
        let _plan = <Plans>request.body;
        super.isRequired(_plan.name, 'O nome do plano é obrigatório');
        super.isRequired(_plan.description, 'A descrição do plano é obrigatória')


        return super.save(_plan, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false,
            },
            order: {
                name: "ASC"
            }
        });
    }


}