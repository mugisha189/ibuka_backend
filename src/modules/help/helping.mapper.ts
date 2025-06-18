import { HelpingEntity } from "./model/helping.entity";
import { DonorEntity } from "./model/donor.entity";
import { CreateHelpRequestDto } from "./dto/create-help-req.dto";
import { CreateHelpDto } from "./dto/create-help.dto";
import { CreateDonorDto } from "./dto/create-donor.dto";
import { DonorsDto } from "./dto/donors.dto";
import { DonationsDto } from "./dto/donations.dto";
import { HelpingDto } from "./dto/helping.dto";
import { MembersEntity } from "../member/models/members.entity";
import { MembersShortDto } from "./dto/members-short.dto";
export class HelpingMapper {

    public static toDtoDonorsList(
        entities: DonorEntity[]
    ): DonorsDto[] {
        return entities.map(HelpingMapper.toDtoDonor);
    }

    public static toDtoDonationsList(
        entities: HelpingEntity[]
    ): DonationsDto[] {
        return entities.map(HelpingMapper.toDtoHelping);
    }

    public static toDtoDonor(
        entity: DonorEntity
    ): DonorsDto {
        return {
            ...Object.assign(new DonorsDto(), entity),
            helping_resources: entity.helping ? entity.helping.length : 0
        }
    }

    public static toDtoHelping(
        entity: HelpingEntity
    ): DonationsDto {
        return {
            ...Object.assign(new DonationsDto(), entity)
        }
    }

    public static toDonorEntity(dto: CreateDonorDto): DonorEntity {
        return Object.assign(new DonorEntity(), dto)
    }

    public static toHelpingEntities(dto: CreateHelpRequestDto): HelpingEntity[] {
        return dto.help.map((helpDto: CreateHelpDto) => {
            const helping = new HelpingEntity();
            helping.items = helpDto.items;
            helping.amount = helpDto.amount;
            helping.donorId = dto.donorId;
            return helping;
        });
    }
    public static toDtoHelpingAll(entity: HelpingEntity): HelpingDto {
        const dto = Object.assign(new HelpingDto(), entity);
        dto.donorId = entity.donorId ?? null;
        dto.donor_names = entity.donor ? entity.donor.names : null;
        const beneficiaries: Array<any> = [];
        if (entity.members && Array.isArray(entity.members)) {
          beneficiaries.push(
            ...entity.members.map(member => ({
              memberId: member.id,
              memberName: member.name
            }))
          );
        }
        if (entity.families && Array.isArray(entity.families)) {
          beneficiaries.push(
            ...entity.families.map(family => ({
              familyId: family.id,
              familyName: family.family_name
            }))
          );
        }
        dto.beneficiaries = beneficiaries;
        return dto;
      }

      public static toDtoMembers(
        entities: MembersEntity[] | MembersEntity
      ): MembersShortDto[] {
        if (Array.isArray(entities)) {
          return entities.map(entity => ({
            ...Object.assign(new MembersShortDto(), entity)
          }));
        } else {
            return [Object.assign(new MembersShortDto(), entities)]
        }
      }
      
}