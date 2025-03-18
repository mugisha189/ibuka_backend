import { CommonEntity } from "src/common/entities";
import { Column, Entity, OneToMany } from 'typeorm';
import { MembersEntity } from "./members.entity";
import { TestimonialsEntity } from "./testimonials.entity";

@Entity({ name: "family", schema: "families" })
export class FamilyEntity extends CommonEntity {

    @Column({ nullable: true, default: "None" })
    former_district: string;

    @Column({ nullable: true, default: "None" })
    former_sector: string;

    @Column({ nullable: true, default: "None" })
    former_cell: string;

    @Column({ nullable: true, default: "None" })
    former_village: string;

    @OneToMany(() => MembersEntity, (members) => members.family, { eager: true, cascade: true })
    members: MembersEntity[];

    @OneToMany(() => TestimonialsEntity, (testimonials) => testimonials.family, { eager: true, cascade: true })
    testimonials: TestimonialsEntity[];

}