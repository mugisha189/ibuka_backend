import { CreateFamilyDto } from "./dto/create-family.dto";
import { FamilyEntity } from "./models/family.entity";
import { FamilyDto } from "./dto/family.dto";
import { EMemberRole, EMemberStatus } from "./enum";
import { FamilyProp } from "./dto/family-prop.dto";
import { FamilyStructureDto } from "./dto/family-structure.dto";
import { MemberMapper } from "../member/member.mapper";
import { TestimonialMapper } from "../testimonials/testimonial.mapper";

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



    public static toFamilyDtoPropertie(entity: FamilyEntity): FamilyProp {
        return {
            ...Object.assign(new FamilyProp(), entity),
            members: entity.members ? MemberMapper.toMembersDtoList(entity.members) : [],
            testimonials: entity.testimonials ? TestimonialMapper.toTestimonialsDtoList(entity.testimonials) : []
        }
    }

    public static toFamilyDto(entity: FamilyEntity): FamilyDto {
        return {
            ...Object.assign(new FamilyDto(), entity),
            members: entity.members ? entity.members.length : 0,
            testimonials: entity.testimonials ? entity.testimonials.length : 0,
            deceased: entity.members ? entity.members.map(member => member.status === EMemberStatus.DISSEIZED).length : 0,
            survived: entity.members ? entity.members.map(member => member.status === EMemberStatus.SURVIVED).length : 0
        };
    }
    
    public static toCreateEntity(dto: CreateFamilyDto): FamilyEntity {
        console.log(dto)
        return Object.assign(new FamilyEntity(), {
            family_name: dto.family_general?.family_name ?? "None",
            former_district: dto.family_general?.former_district ?? "None",
            former_sector: dto.family_general?.former_sector ?? "None",
            former_cell: dto.family_general?.former_cell ?? "None",
            former_village: dto.family_general?.former_village ?? "None"
        });
    }


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
        dto.deceased_members = deceased.length;
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