import { ApiProperty } from '@nestjs/swagger';
import { MembersDto } from './members.dto';
import { TestimonialsDto } from './testimonials.dto';

export class FamilyProp {

    @ApiProperty({ type: [MembersDto] })
    members: MembersDto[];

    @ApiProperty({ type: [TestimonialsDto] })
    testimonials: TestimonialsDto[];
    
}