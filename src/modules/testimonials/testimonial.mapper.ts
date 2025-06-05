import { TestimonialsEntity } from "./models/testimonials.entity";
import { CreateTestimonialsDto } from "./dto/create-testimonials.dto";
import { TestimonialsDto } from "./dto/testimonials.dto";

export class TestimonialMapper {

    public static isValidValue(value: any): boolean {
        return value !== undefined &&
               value !== null &&
               value !== '' &&
               !(typeof value === 'string' && (value.trim() === '' || value === 'string')) &&
               !(Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === 'string')));
    }


    public static toTestimonialsDtoList(entities: TestimonialsEntity[]): TestimonialsDto[] {
        return entities.map(TestimonialMapper.toTestimonialsDto);
    }
    
    // public static toTestimonialsDto(entity: TestimonialsEntity): TestimonialsDto {
    //     const dto = new TestimonialsDto();
    //     Object.assign(dto, entity);
    //     return dto;
    // }

    

    public static toCreateTestimonialsEntity(
        dto: CreateTestimonialsDto
    ): TestimonialsEntity {
        return Object.assign(new TestimonialsEntity(), dto);
    }


    static toTestimonialsDto(entity: TestimonialsEntity): TestimonialsDto {
        const dto = new TestimonialsDto();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.description = entity.description;
        dto.family_member = String(entity.family_member);
        dto.testimonial_names = entity.testimonial_names;
        dto.national_id = entity.national_id;
        dto.familyId = entity.familyId;
        dto.memberId = entity.memberId;
        dto.testimonial_files = entity.testimonial_files;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
      } 
    
}