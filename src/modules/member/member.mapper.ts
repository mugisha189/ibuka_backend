import { MembersEntity } from "./models/members.entity";
import { MembersDto } from "./dto/members.dto";
import { CreateMemberDto } from "./dto/create-member.dto";
import { IbukaMemberDto } from "./dto/ibuka-member.dto";

export class MemberMapper {

    public static isValidValue(value: any): boolean {
        return value !== undefined &&
               value !== null &&
               value !== '' &&
               !(typeof value === 'string' && (value.trim() === '' || value === 'string')) &&
               !(Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === 'string')));
    }


    public static toMembersDtoList(entities: MembersEntity[]): MembersDto[] {
        return entities.map(MemberMapper.toMemberDto);
    }

    
    public static toMemberDto(entity: MembersEntity): MembersDto {
        return {
            ...Object.assign(new MembersDto(), entity)
        }
    }

    public static mapSingleMember(dto: CreateMemberDto, familyId: string): MembersEntity {
        return {
            ...dto,
            familyId
        } as MembersEntity;
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
            status: member.status,
            survival_village: member.survival_village,
            former_district: member?.family?.former_district,
            former_sector: member?.family?.former_sector,
            former_cell: member?.family?.former_cell,
            former_village: member?.family?.former_village,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        }));
    }



}