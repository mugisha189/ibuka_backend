import { CommonEntity } from "src/common/entities";
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DonorEntity } from "./donor.entity";
@Entity({ name: "helping", schema: "helpings" })
export class HelpingEntity extends CommonEntity {

    @Column({ nullable: false, default: "None"  })
    items: string;

    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    donorId: string;

    @ManyToOne(() => DonorEntity, (donor) => donor.helping)
    @JoinColumn({ name: "donorId" })
    donor: DonorEntity;

}