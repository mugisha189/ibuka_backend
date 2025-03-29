import { CommonEntity } from "src/common/entities";
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { FamilyEntity } from "./family.entity";
import { MembersEntity } from "./members.entity";

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

    @OneToMany(() => MembersEntity, (member) => member.memorial, { eager: true, cascade: true })
    members: MembersEntity[];

    @ManyToMany(() => FamilyEntity, (family) => family.memorials, { eager: true, cascade: true })
    @JoinTable({
        schema: "memorials",
        name: "memorials_family",
        joinColumn: {
            name: "memorialId",
            referencedColumnName:"id"
        },
        inverseJoinColumn: {
            name: "familyId",
            referencedColumnName: "id"
        }
    })
    families: FamilyEntity[];


}