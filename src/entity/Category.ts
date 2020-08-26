import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";
import { Points } from "./Points";

@Entity({ name: 'Category' })
export class Category extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider

}


