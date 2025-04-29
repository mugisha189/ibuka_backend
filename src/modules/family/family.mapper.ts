import { CreateFamilyDto } from "./dto/create-family.dto";
import { MembersEntity } from "./models/members.entity";
import { FamilyEntity } from "./models/family.entity";
import { TestimonialsEntity } from "./models/testimonials.entity";
import { CreateTestimonialsDto } from "./dto/create-testimonials.dto";
import { FamilyDto } from "./dto/family.dto";
import { TestimonialsDto } from "./dto/testimonials.dto";
import { EMemberRole, EMemberStatus } from "./enum";
import { MembersDto } from "./dto/members.dto";
import { FamilyProp } from "./dto/family-prop.dto";
import { MemorialResponseDto } from "./dto/memorial-response.dto";
import { MemorialsEntity } from "./models/memorials.entity";
import { CreateMemorialDto } from "./dto/create-memorial.dto";
import { MemorialMemberDto } from "./dto/memorial-member.dto";
import { IbukaMemberDto } from "./dto/ibuka-member.dto";
import { MemorialShortDto } from "./dto/memorial-short.dto";
import { FamilyStructureDto } from "./dto/family-structure.dto";

export class FamilyMapper {

    public static isValidValue(value: any): boolean {
        return value !== undefined &&
               value !== null &&
               value !== '' &&
               !(typeof value === 'string' && (value.trim() === '' || value === 'string')) &&
               !(Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === 'string')));
    }

    public static toMemorialsShortList(
        entities: MemorialsEntity[]
    ): MemorialShortDto[] {
        return entities.map(FamilyMapper.toMemorialShortDto);
    }

    public static toMemorialShortDto(
        entity: MemorialsEntity
    ): MemorialShortDto{
        return {
            ...Object.assign(new MemorialShortDto(), entity)
        }
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
            family_name: dto.family_general[0]?.family_name ?? "None",
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

    static toIbukaMembersDtoList(members: MembersEntity[]): IbukaMemberDto[] {
        return members.map(member => ({
            id: member.id,
            name: member.name,
            family_name: member.family?.family_name,
            testimonials: member?.testimonials?.length || 0,
            death_province: member.death_province,
            death_district: member.death_district,
            death_sector: member.death_sector,
            death_cell: member.death_cell,
            death_village: member.death_village,
            survival_province: member.survival_province,
            survival_district: member.survival_district,
            survival_sector: member.survival_sector,
            survival_cell: member.survival_cell,
            survival_village: member.survival_village,
            former_district: member?.family?.former_district,
            former_sector: member?.family?.former_sector,
            former_cell: member?.family?.former_cell,
            former_village: member?.family?.former_village,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        }));
    }

    // public static toIbukaMembersDtoList(
    //     entities: MembersEntity[]
    // ): IbukaMemberDto[] {
    //     return entities.map(FamilyMapper.toIbukaMemberDto);
    // }

    public static async toDtoFamilyStructure(
        family: FamilyEntity
    ): Promise<FamilyStructureDto> {
        const dto = new FamilyStructureDto();

        const members = family.members || [];
        const parents = members.filter(m => m.role === EMemberRole.FATHER || m.role === EMemberRole.MOTHER);
        const children = members.filter(m => m.role === EMemberRole.CHILD);
        const deceased = members.filter(m => m.status === EMemberStatus.DISSEIZED);
        const survived = members.filter(m => m.status === EMemberStatus.SURVIVED);
        const father = members.find(m => m.role === EMemberRole.FATHER);
        const mother = members.find(m => m.role === EMemberRole.MOTHER);
        const addressSource = members[0];
        dto.parents = parents.length;
        dto.children = children.length;
        dto.disseised_members = deceased.length;
        dto.survived = survived.length;
        dto.father = father?.name || '';
        dto.mother = mother?.name || '';
        dto.family_head = father?.name || '';
        dto.family_members = members.map(m => m.name).join(', ');
        dto.sector = addressSource?.current_sector || 'Unknown';
        dto.cell = addressSource?.current_cell || 'Unknown';
        dto.village = addressSource?.current_village || 'Unknown';

        return dto;
    }
    
}