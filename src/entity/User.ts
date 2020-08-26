import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";
import { Points } from "./Points";

@Entity({ name: 'User' })
export class User extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    photo: string;

    @Column({ type: 'varchar', length: 200 })
    email: string;

    @Column({ type: 'varchar', length: 200 })
    phone: string;

    @Column({ type: 'varchar', length: 200 })
    birth: string;   

    @Column({ type: 'varchar', length: 200 })
    cpf: string;

    @Column({ default: false })
    isRoot: boolean;

    @Column({ type: 'varchar', length: 100 })
    password: string;

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

    @Column({ type: 'varchar', length: 500 })
    fbId: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider



}


