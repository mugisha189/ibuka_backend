import { CommonEntity } from "src/common/entities";
import { Column, Entity, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { DonorEntity } from "./donor.entity";
import { MembersEntity } from "src/modules/family/models/members.entity";
import { FamilyEntity } from "src/modules/family/models/family.entity";
@Entity({ name: "helping", schema: "helpings" })
export class HelpingEntity extends CommonEntity {

    @Column({ nullable: false, default: "None"  })
    items: string;

    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    remaining_amount: number;

    @Column({ nullable: false })
    given_amount: number;

    @Column({ nullable: false })
    donorId: string;

    @ManyToOne(() => DonorEntity, (donor) => donor.helping)
    @JoinColumn({ name: "donorId" })
    donor: DonorEntity;

    @ManyToMany(() => MembersEntity, (members) => members.helping, { eager: true, cascade: true })
    members: MembersEntity[];

    @ManyToMany(() => FamilyEntity, (families) => families.helping, { eager: true, cascade: true })
    families: FamilyEntity[];

}