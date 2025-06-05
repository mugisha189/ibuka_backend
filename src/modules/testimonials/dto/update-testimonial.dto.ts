import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTestimonialRequestDto } from './create-testimonial-req.dto';
import { IsOptional } from 'class-validator';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialRequestDto) {
  @ApiProperty({ required: false, description: 'Title of the testimonial' })
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, description: 'Description of the testimonial' })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, description: 'Whether the testimonial is from a family member' })
  @IsOptional()
  family_member?: boolean;

  @ApiProperty({ required: false, description: 'Names associated with the testimonial' })
  @IsOptional()
  testimonial_names?: string;

  @ApiProperty({ required: false, description: 'National ID of the testimonial author' })
  @IsOptional()
  national_id?: string;

  @ApiProperty({ required: false, description: 'Family ID associated with the testimonial' })
  @IsOptional()
  familyId?: string;

  @ApiProperty({ required: false, description: 'Member ID associated with the testimonial' })
  @IsOptional()
  memberId?: string;

  @ApiProperty({ required: false, description: 'Files associated with the testimonial', type: 'string', isArray: true })
  @IsOptional()
  testimonial_files?: string[];
} 