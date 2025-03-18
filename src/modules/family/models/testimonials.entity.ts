import { CommonEntity } from "src/common/entities";
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { FamilyEntity } from "./family.entity";
@Entity({ name: "testimonials", schema: "families" })
export class TestimonialsEntity extends CommonEntity {

    @Column({ nullable: false, default: "None" })
    title: string;

    @Column({ nullable: true, default: "None" })
    description: string;

    @Column({ nullable: false, default: false })
    family_member: boolean;

    @Column({ nullable: false, default: "None" })
    testimonial_names: string;

    @Column({ nullable: true, default: "None" })
    national_id: string;

    @Column({ nullable: false })
    familyId: string;

    @Column({ nullable: true, type: "jsonb", default: [] })
    file_links: string[];

    @ManyToOne(() => FamilyEntity, (family) => family.testimonials)
    @JoinColumn({ name: "familyId" })
    family: FamilyEntity;
}