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
import { Category } from '../entity/Category';
import { Notification } from '../entity/Notification';

export class CategoryController extends BaseController<Category> {


    constructor() {
        super(Category);
    }
    private _notificationRepository = getRepository(Notification);

    async save(request: Request) {
        let _category = <Category>request.body;


        return super.save(_category, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }
}