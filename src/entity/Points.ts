import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";
import { User } from "./User";
import { Agenda } from "./Agenda";

@Entity({ name: 'Points' })
export class Points extends BaseEntity {

    @Column()
    points: number;

    @ManyToOne(() => ServiceProvider, { eager: true, nullable: true }) //AutoPopulate
    serviceProvider: ServiceProvider

    @ManyToOne(() => User, { eager: true, nullable: true }) //AutoPopulate
    user: User

    @ManyToOne(() => Agenda, { eager: true, nullable: true }) //AutoPopulate
    agenda: Agenda


}


