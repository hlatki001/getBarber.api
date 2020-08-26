import { Entity, Column, ManyToOne, Double } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { ServiceProvider } from "./ServiceProvider";
import { Plans } from "./Plans";

@Entity({ name: 'Sale' })
export class Sale extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column()
    status: number;

    @Column({ type: 'double' })
    totalPrice;

    @Column({ type: 'varchar', length: 200 })
    transactionId: string;

    @Column({ type: 'varchar', length: 500 })
    paymentLink: string;


    @ManyToOne(() => Plans, { eager: true }) //AutoPopulate
    plan: Plans

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider

}


