import { CommonEntity } from "src/common/entities";
import { Column, Entity, OneToMany, ManyToMany } from 'typeorm';
import { MembersEntity } from "./members.entity";
import { TestimonialsEntity } from "./testimonials.entity";
import { EFamilyStatus } from "../enum/family-status.enum";
import { MemorialsEntity } from "./memorials.entity";
@Entity({ name: "family", schema: "families" })
export class FamilyEntity extends CommonEntity {

    @Column({ nullable: false, unique: true })
    family_name: string;

    @Column({ nullable: true, default: "None" })
    former_district: string;

    @Column({ nullable: true, default: "None" })
    former_sector: string;

    @Column({ nullable: false, type: 'enum', enum: EFamilyStatus, default: EFamilyStatus.NONE })
    status: EFamilyStatus;

    @Column({ nullable: true, default: "None" })
    former_cell: string;

    @Column({ nullable: true, default: "None" })
    former_village: string;

    @OneToMany(() => MembersEntity, (members) => members.family, { eager: true, cascade: true })
    members: MembersEntity[];

    @OneToMany(() => TestimonialsEntity, (testimonials) => testimonials.family, { eager: true, cascade: true })
    testimonials: TestimonialsEntity[];

    @ManyToMany(() => MemorialsEntity, (memorial) => memorial.families)
    memorials: MemorialsEntity[];

}