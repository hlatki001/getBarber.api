import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'Plans' })
export class Plans extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column()
    professionals: number;

    @Column()
    places: number;

    @Column()
    test: boolean;

    @Column({ type: 'varchar', length: 500 })
    price: string;

    @Column()
    peridiocity: number;

}


