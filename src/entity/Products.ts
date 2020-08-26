import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ServiceProvider } from "./ServiceProvider";
import { Points } from "./Points";
import { Category } from "./Category";

@Entity({ name: 'Products' })
export class Products extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    price: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    points: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider

    @ManyToOne(() => Category, { eager: true }) //AutoPopulate
    category: Category

    @Column({ default: false })
    isPromotion: boolean;



}


