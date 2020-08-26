import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'Service' })
export class Service extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    photo: string;

    @Column({ type: 'varchar', length: 200 })
    price: string;

    @Column()
    points: number;

    @Column({ type: 'varchar', length: 300 })
    description: string;

    @ManyToOne(() => Place, { eager: true }) //AutoPopulate
    place: Place

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider


}


