import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Professional } from "../entity/Professional";
import { FileHelper } from '../helpers/fileHelper';
import { Place } from '../entity/Place';
import { Plans } from '../entity/Plans';
import { ServiceProvider } from '../entity/ServiceProvider';

export class ProfessionalController extends BaseController<Professional> {


    constructor() {
        super(Professional, true);
    }

    async save(request: Request) {
        let _professional = <Professional>request.body;
        super.isRequired(_professional.name, 'O nome do profissional é obrigatório');
        super.isRequired(_professional.email, 'O email do profissional é obrigatório');
        super.isRequired(_professional.phone, 'O telefone do profissional é obrigatório');
        super.isRequired(_professional.place, 'A filial do profissional é obrigatória')
        super.isRequired(_professional.description, 'A descrição do profissional é obrigatória')

        if (_professional.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_professional.photo)
            if (pictureCreatedResult)
                _professional.photo = pictureCreatedResult
        }

        const professionals = getRepository(Professional)
        const place = getRepository(Place)
        const plans = getRepository(Plans)
        const serviceProvider = getRepository(ServiceProvider)

        const professionalCount = await professionals.count({
            where: {
                serviceProvider: _professional.serviceProvider,
                active: true,
                deleted: false
            }
        });

        const SP = await serviceProvider.findOne({
            where: {
                uid: _professional.serviceProvider,
                active: true,
                deleted: false
            }
        });

        if (SP) {
            const PL = await plans.findOne({
                where: {
                    uid: SP.plan.uid,
                    active: true,
                    deleted: false
                }
            });

            if (PL) {
                console.log('plano', PL.professionals)
                console.log('contagem', professionalCount)

                if (professionalCount >= PL.professionals) {
                    return { status: 400, message: `Você atingiu o limite de profissionais (${PL.professionals}) de seu plano, remova ou atualize para um plano maior.` };
                }
            }
            else{
                return { status: 400, message: `Erro no módulo de PLANOS, contacte o administrador` };

            }
        }
        else{
            return { status: 400, message: `Erro no módulo de PROVEDOR, contacte o administrador` };

        }



        return super.save(_professional, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }

    async getAllProfessionalsPerPlace(request: Request) {
        const { id } = request.params;
        return this.repository.find({
            where: {
                place: id,
                active: true,
                deleted: false
            }
        });
    }

}