import { CreateFamilyDto } from "./dto/create-family.dto";
import { MembersEntity } from "./models/members.entity";
import { FamilyEntity } from "./models/family.entity";
import { TestimonialsEntity } from "./models/testimonials.entity";
import { CreateTestimonialsDto } from "./dto/create-testimonials.dto";
import { FamilyDto } from "./dto/family.dto";
import { TestimonialsDto } from "./dto/testimonials.dto";
import { EMemberStatus } from "./enum";
import { MembersDto } from "./dto/members.dto";
import { FamilyProp } from "./dto/family-prop.dto";
import { MemorialResponseDto } from "./dto/memorial-response.dto";
import { MemorialsEntity } from "./models/memorials.entity";
import { CreateMemorialDto } from "./dto/create-memorial.dto";
import { MemorialMemberDto } from "./dto/memorial-member.dto";
import { IbukaMemberDto } from "./dto/ibuka-member.dto";

export class FamilyMapper {

    public static isValidValue(value: any): boolean {
        return value !== undefined &&
               value !== null &&
               value !== '' &&
               !(typeof value === 'string' && (value.trim() === '' || value === 'string')) &&
               !(Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === 'string')));
    }

    public static toFamilyDtoList(entities: FamilyEntity[]): FamilyDto[] {
        return entities.map(FamilyMapper.toFamilyDto);
    }

    public static toMembersDtoList(entities: MembersEntity[]): MembersDto[] {
        return entities.map(FamilyMapper.toMemberDto);
    }

    public static toTestimonialsDtoList(entities: TestimonialsEntity[]): TestimonialsDto[] {
        return entities.map(FamilyMapper.toTestimonialsDto);
    }
    
    public static toMemberDto(entity: MembersEntity): MembersDto {
        return {
            ...Object.assign(new MembersDto(), entity)
        }
    }

    public static toTestimonialsDto(entity: TestimonialsEntity): TestimonialsDto {
        const dto = new TestimonialsDto();
        Object.assign(dto, entity);
        return dto;
    }
    

    public static toFamilyDtoPropertie(entity: FamilyEntity): FamilyProp {
        return {
            ...Object.assign(new FamilyProp(), entity),
            members: entity.members ? FamilyMapper.toMembersDtoList(entity.members) : [],
            testimonials: entity.testimonials ? FamilyMapper.toTestimonialsDtoList(entity.testimonials) : []
        }
    }

    public static toFamilyDto(entity: FamilyEntity): FamilyDto {
        return {
            ...Object.assign(new FamilyDto(), entity),
            members: entity.members ? entity.members.length : 0,
            testimonials: entity.testimonials ? entity.testimonials.length : 0,
            disseised: entity.members ? entity.members.map(member => member.status === EMemberStatus.DISSEIZED).length : 0,
            survived: entity.members ? entity.members.map(member => member.status === EMemberStatus.SURVIVED).length : 0
        };
    }
    
    public static toCreateEntity(dto: CreateFamilyDto): FamilyEntity {
        return Object.assign(new FamilyEntity(), {
            former_district: dto.family_general[0]?.former_district ?? "None",
            former_sector: dto.family_general[0]?.former_sector ?? "None",
            former_cell: dto.family_general[0]?.former_cell ?? "None",
            former_village: dto.family_general[0]?.former_village ?? "None"
        });
    }

    public static toCreateMemorialEntity(
        dto: CreateMemorialDto
    ): MemorialsEntity {
        return Object.assign(new MemorialsEntity(), dto);
    }

    public static toMemorialDto(
        entity: MemorialsEntity
    ): MemorialResponseDto {
        return {
            ...Object.assign(new MemorialResponseDto(), entity),
            bodies: entity.members ? entity.members.length : 0
        }
    }

    public static toMemorialsListDto(
        entities: MemorialsEntity[]
    ): MemorialResponseDto[] {
        return entities.map(FamilyMapper.toMemorialDto);
    }
    

    public static toCreateTestimonialsEntity(
        dto: CreateTestimonialsDto
    ): TestimonialsEntity {
        return Object.assign(new TestimonialsEntity(), dto);
    }

    public static mapMembers(dto: CreateFamilyDto, familyId: string): MembersEntity[] {
        return dto.members.map((memberDto) => ({
            ...memberDto,
            familyId
        })) as MembersEntity[];
    }

    public static mapMemorialMemberDto(
        entity: MembersEntity
    ): MemorialMemberDto {
        return {
            ...Object.assign(new MemorialMemberDto(), entity),
            family_name: entity.family.family_name,
            former_district: entity.family.former_district,
            former_sector: entity.family.former_sector,
            former_cell: entity.family.former_cell,
            former_village: entity.family.former_village
        }
    }

    public static mapMemorialMembersList(
        entities: MembersEntity[]
    ): MemorialMemberDto[] {
        return entities.map(FamilyMapper.mapMemorialMemberDto);
    }

    public static toIbukaMemberDto(
        entity: MembersEntity
    ): IbukaMemberDto {
        return {
            ...Object.assign(new IbukaMemberDto(), entity),
            family_name: entity.family.family_name,
            former_district: entity.family.former_district,
            former_sector: entity.family.former_sector,
            former_cell: entity.family.former_cell,
            former_village: entity.family.former_village,
            testimonials: entity?.testimonials ? entity.testimonials.length : 0
        }
    }

    public static toIbukaMembersDtoList(
        entities: MembersEntity[]
    ): IbukaMemberDto[] {
        return entities.map(FamilyMapper.toIbukaMemberDto);
    }
    
}