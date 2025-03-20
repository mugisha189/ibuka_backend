import { CommonEntity } from "src/common/entities";
import { Entity, Column } from 'typeorm';

@Entity({ name: "memorial", schema: "memorials" })
export class MemorialsEntity extends CommonEntity {

    @Column({ nullable: false, default: "None" })
    names: string;

    @Column({ nullable: false, default: "None" })
    type: string;

    @Column({ nullable: false, default: "None" })
    date_founded: string;

    @Column({ nullable: false, default: "None" })
    former_district: string;

    @Column({ nullable: false, default: "None" })
    former_sector: string;

    @Column({ nullable: false, default: "None" })
    former_cell: string;

    @Column({ nullable: false, default: "None" })
    former_village: string;

}