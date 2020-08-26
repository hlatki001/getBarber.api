import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'Place' })
export class Place extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200 })
    phone: string;

    @Column({ type: 'varchar', length: 200 })
    rua: string;

    @Column({ type: 'varchar', length: 200 })
    estado: string;

    @Column({ type: 'varchar', length: 200 })
    cidade: string;

    @Column({ type: 'varchar', length: 100 })
    numero: string;

    @Column({ type: 'varchar', length: 200 })
    bairro: string;

    @Column({ type: 'varchar', length: 200 })
    cep: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider


}


