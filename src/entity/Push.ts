import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'Push' })
export class Push extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 200 })
    contents: string;

    @Column({ type: 'varchar', length: 200 })
    category: string;

    @Column({ type: 'varchar', length: 200 })
    task: string;

    @Column({ type: 'varchar', length: 200 })
    pushId: string;

    @Column({ type: 'varchar', length: 200 })
    link: string;

    @Column({ type: 'varchar', length: 300 })
    external_id: string;

    @Column({ type: 'varchar', length: 999 })
    user_list: string;

    @ManyToOne(() => ServiceProvider, { eager: true }) //AutoPopulate
    serviceProvider: ServiceProvider

}


