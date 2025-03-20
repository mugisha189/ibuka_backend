import { CommonEntity } from "src/common/entities";
import { Column, Entity } from 'typeorm';

@Entity({ name: "heping", schema: "helpings" })
export class HelpingEntity extends CommonEntity {

    @Column({ nullable: false, default: "None"  })
    items: string;

    @Column({ nullable: false, default: "None"  })
    amount: number;

    @Column({ nullable: false, default: "None"  })
    donor: string;

}