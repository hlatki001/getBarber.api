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

export class PointsController extends BaseController<Points> {

    private _userRepository = getRepository(User)

    constructor() {
        super(Points);
    }

    async save(request: Request) {
        let _points = <Points>request.body;


        return super.save(_points, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

   

    async removePerAgenda(request: Request) {
        let uid = request.params.id as string;

        let point: any = await this.repository.find({
            where: {
                agenda: uid
            }
        });
        if (point) {
            point.points = 0;
            return this.repository.save(point);
        } else {
            return {
                status: 404,
                errors: [
                    'Item não encontrado no banco de dados'
                ]
            }
        }
    }
}