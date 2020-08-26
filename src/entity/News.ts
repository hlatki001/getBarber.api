import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'News' })
export class News extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column({ type: 'varchar', length: 200 })
    photo: string;

    @Column({ type: 'varchar', length: 100 })
    category: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider


}


