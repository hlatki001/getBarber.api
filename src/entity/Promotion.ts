import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'Promotion' })
export class Promotion extends BaseEntity {

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'varchar', length: 200 })
    photo: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column({ type: 'varchar', length: 300 })
    finishDate: string;

    @Column({ type: 'varchar', length: 300 })
    startDate: string;

    @ManyToOne(() => Place, { eager: true }) //AutoPopulate
    place: Place

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider
}


