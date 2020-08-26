import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { Service } from "./Service";
import { User } from "./User";
import { Professional } from "./Professional";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'Agenda' })
export class Agenda extends BaseEntity {


    @Column({ type: 'varchar', length: 200 })
    price: string;

    @Column({ type: 'date' })
    dia: Date;

    @Column({ type: 'varchar', length: 300 })
    horario: string;

    @Column({ type: 'varchar', length: 300 })
    points: string;

    @Column({ type: 'varchar', length: 400, nullable: true })
    pushId: string;

    @Column()
    statusAtendimento: number;

    @ManyToOne(() => Place, { eager: true }) //AutoPopulate
    place: Place

    @ManyToOne(() => Service, { eager: true }) //AutoPopulate
    service: Service

    @ManyToOne(() => User, { eager: true }) //AutoPopulate
    user: User

    @ManyToOne(() => Professional, { eager: true }) //AutoPopulate
    professional: Professional

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider
}


