import { CommonEntity } from "src/common/entities";
import { Column, Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { MembersEntity } from "../../member/models/members.entity";
import { TestimonialsEntity } from "./testimonials.entity";
import { EFamilyStatus } from "../enum/family-status.enum";
import { MemorialsEntity } from "../../memorials/models/memorials.entity";
import { HelpingEntity } from "src/modules/help/model/helping.entity";
@Entity({ name: "family" })
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

    @ManyToMany(() => HelpingEntity, (helping) => helping.families)
    @JoinTable({
        
        name: "helping_families",
        joinColumn: {
            name: "familyId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "helpingId",
            referencedColumnName: "id"
        }
    })
    helping: HelpingEntity[];


}