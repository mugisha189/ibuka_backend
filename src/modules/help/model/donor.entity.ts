import { CommonEntity } from "src/common/entities";
import { Column, Entity, OneToMany } from 'typeorm';
import { HelpingEntity } from "./helping.entity";

@Entity({ name: "donors" })
export class DonorEntity extends CommonEntity {

    @Column({ nullable: false, default: "None" })
    names: string;

    @Column({ nullable: false, default: "None" })
    phone_number: string;

    @Column({ nullable: false, default: "None" })
    national_id: string;

    @OneToMany(() => HelpingEntity, (helping) => helping.donor, { eager: true, cascade:true })
    helping: HelpingEntity[];

}