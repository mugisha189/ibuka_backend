import { CreateFamilyDto } from "./dto/create-family.dto";
import { MembersEntity } from "./models/members.entity";
import { FamilyEntity } from "./models/family.entity";

export class FamilyMapper {

    public static isValidValue(value: any): boolean {
        return value !== undefined &&
               value !== null &&
               value !== '' &&
               !(typeof value === 'string' && (value.trim() === '' || value === 'string')) &&
               !(Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === 'string')));
    }

    public static toCreateEntity(
        dto: CreateFamilyDto
    ): FamilyEntity {
        const keys = new Set(['former_district', 'former_sector', 'former_cell', 'former_village'])
        const entity = new FamilyEntity();
        Object.keys(dto).forEach((key) => {
            if(keys.has(key)){
                (entity as any)[key] = dto[key];
            }
        })
        return entity;
    }

    public static mapMembers(dto: CreateFamilyDto, familyId: string): MembersEntity[] {
        return dto.members.map((memberDto) => ({
            ...memberDto,
            familyId
        })) as MembersEntity[];
    }
    
}