import { Request } from 'express';
import { BaseController } from "./BaseController";
import { getRepository } from 'typeorm';
import { Place } from "../entity/Place";
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { Promotion } from '../entity/Promotion';
import { Plans } from '../entity/Plans';
import { ServiceProvider } from '../entity/ServiceProvider';

export class PlaceController extends BaseController<Place> {

    private _professionalsRepository = getRepository(Professional)
    private _servicesRepository = getRepository(Service)
    private _promotionsRepository = getRepository(Promotion)

    constructor() {
        super(Place, true);
    }

    async save(request: Request) {
        let _place = <Place>request.body;
        super.isRequired(_place.name, 'O nome da filial é obrigatória');
        super.isRequired(_place.phone, 'O telefone da filial é obrigatório');
        super.isRequired(_place.rua, 'A rua da filial é obrigatória');
        super.isRequired(_place.estado, 'O estado da filial é obrigatório');
        super.isRequired(_place.cidade, 'A cidade da filial é obrigatória');
        super.isRequired(_place.numero, 'O numero da filial é obrigatório');
        super.isRequired(_place.bairro, 'O bairro da filial é obrigatório');
        super.isRequired(_place.cep, 'O CEP da filial é obrigatório');

        const professionals = getRepository(Professional)
        const place = getRepository(Place)
        const plans = getRepository(Plans)
        const serviceProvider = getRepository(ServiceProvider)

        const placeCount = await place.count({
            where: {
                serviceProvider: _place.serviceProvider,
                active: true,
                deleted: false
            }
        });

        const SP = await serviceProvider.findOne({
            where: {
                uid: _place.serviceProvider.uid,
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
                console.log('plano', PL.places)
                console.log('contagem', placeCount)

                if (placeCount >= PL.places) {
                    return { status: 400, message: `Você atingiu o limite de filiais (${PL.places}) de seu plano, remova ou atualize para um plano maior.` };
                }
            }
            else {
                return { status: 400, message: `Erro no módulo de PLANOS, contacte o administrador` };

            }
        }
        else {
            return { status: 400, message: `Erro no módulo de PROVEDOR, contacte o administrador` };

        }



        return super.save(_place, request);
    }

    async all(request: Request) {
        return this.repository.find({
            where: {
                deleted: false
            }
        });
    }



    async getProfessionalsPerPlace(request: Request) {
        const { id: professionalId } = request.params;
        return this._professionalsRepository.find({
            where: {
                place: professionalId,
                deleted: false
            }
        })
    }

    async getServicesPerPlace(request: Request) {
        const { id: serviceId } = request.params;
        return this._servicesRepository.find({
            where: {
                place: serviceId,
                deleted: false
            }
        })
    }

    async getPromotionsPerPlace(request: Request) {
        const { id: serviceId } = request.params;
        return this._promotionsRepository.find({
            where: {
                place: serviceId,
                deleted: false
            }
        })
    }


}