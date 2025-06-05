import { CommonEntity } from "src/common/entities";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { EMemberRole } from "../enum/member-role.enum";
import { EMemberStatus } from "../enum/member-status.enum";
import { FamilyEntity } from "./family.entity";
import { TestimonialsEntity } from "./testimonials.entity";
import { Unique } from 'typeorm';
import { HelpingEntity } from "src/modules/help/model/helping.entity";
import { MemorialsEntity } from "src/modules/memorials/models/memorials.entity";
@Entity({ name: "members", schema: "families" })
@Unique(['name', 'national_id', 'birth_date', 'familyId', 'profile_picture', 'remembrance_day'])
export class MembersEntity extends CommonEntity {

    @Column({ nullable: false, default: "None" })
    name: string;

    @Column({ nullable: true, default: "None" })
    national_id: string;

    @Column({ nullable: false, default: "None" })
    birth_date: string;

    @Column({ nullable: false, default: "Present" })
    death_date: string;

    @Column({ nullable: false, type: 'enum', enum: EMemberRole, default: EMemberRole.NONE })
    role: EMemberRole;

    @Column({ nullable: false, type: 'enum', enum: EMemberStatus, default: EMemberStatus.NONE })
    status: EMemberStatus;

    @Column({ nullable: true, default: "None" })
    remembrance_day: string;

    @Column({ nullable: true, default: "None" })
    memorial_site: string;

    @Column({ nullable: true, default: "None" })
    death_province: string;

    @Column({ nullable: true, default: "None" })
    death_district: string;

    @Column({ nullable: true, default: "None" })
    death_sector: string;

    @Column({ nullable: true, default: "None" })
    death_cell: string;

    @Column({ nullable: true, default: "None" })
    death_village: string;

    @Column({ nullable: true, default: "None" })
    survival_province: string;

    @Column({ nullable: true, default: "None" })
    survival_district: string;

    @Column({ nullable: true, default: "None" })
    survival_sector: string;

    @Column({ nullable: true, default: "None" })
    survival_cell: string;

    @Column({ nullable: true, default: "None" })
    survival_village: string;

    @Column({ nullable: true, default: "None" })
    current_district: string;

    @Column({ nullable: true, default: "None" })
    current_sector: string;

    @Column({ nullable: true, default: "None" })
    current_cell: string;

    @Column({ nullable: true, default: "None" })
    current_village: string;

    @Column({ nullable: true, default: "" })
    profile_picture: string;

    @Column({ nullable: false })
    familyId: string;

    @Column({ nullable: true })
    memorialId: string;

    @OneToMany(() => TestimonialsEntity, (testimonial) => testimonial.member, { eager: true, cascade: true })
    testimonials: TestimonialsEntity[];
    
    @ManyToOne(() => FamilyEntity, (family) => family.members)
    @JoinColumn({ name: "familyId" })
    family: FamilyEntity;

    @ManyToOne(() => MemorialsEntity, (memorial) => memorial.members)
    @JoinColumn({ name: "memorialId" })
    memorial: MemorialsEntity;

    @ManyToMany(() => HelpingEntity, (helping) => helping.members)
    @JoinTable({
            schema: "families",
            name: "helping_members",
            joinColumn: {
                name: "memberId",
                referencedColumnName: "id"
            },
            inverseJoinColumn: {
                name: "helpingId",
                referencedColumnName: "id"
            }
        })
    helping: HelpingEntity[];

}