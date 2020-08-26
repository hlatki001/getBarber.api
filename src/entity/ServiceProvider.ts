import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Plans } from "./Plans";

@Entity({ name: 'ServiceProvider' })
export class ServiceProvider extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200 })
    photo: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    idCode: string;

    @Column({ type: 'varchar', length: 200 })
    email: string;

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

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column()
    pushs: number;

    @Column()
    role: number;

    @Column({ nullable: true })
    planStartDate: Date;

    @Column({ nullable: true })
    planActive: boolean;

    @Column({ nullable: true })
    planFinishDate: Date;

    @Column({ default: false })
    isRoot: boolean;

    @ManyToOne(() => Plans, { eager: true, nullable: true }) //AutoPopulate
    plan: Plans


}


