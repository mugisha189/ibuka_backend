import { MemorialResponseDto } from "./dto/memorial-response.dto";
import { MemorialsEntity } from "./models/memorials.entity";
import { CreateMemorialDto } from "./dto/create-memorial.dto";
import { MemorialMemberDto } from "./dto/memorial-member.dto";
import { MemorialShortDto } from "./dto/memorial-short.dto";
import { MembersEntity } from "../member/models/members.entity";

export class MemorialMapper {

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
        return entities.map(MemorialMapper.toMemorialShortDto);
    }

    public static toMemorialShortDto(
        entity: MemorialsEntity
    ): MemorialShortDto{
        return {
            ...Object.assign(new MemorialShortDto(), entity)
        }
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
        return entities.map(MemorialMapper.toMemorialDto);
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
        return entities.map(MemorialMapper.mapMemorialMemberDto);
    }

    
}