import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'Admin' })
export class Admin extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200 })
    email: string;

    @Column({ type: 'varchar', length: 500 })
    password: string;

    @Column({ default: false })
    isRoot: boolean;

}


