import { HelpingEntity } from "./model/helping.entity";
import { DonorEntity } from "./model/donor.entity";
import { CreateHelpRequestDto } from "./dto/create-help-req.dto";
import { CreateHelpDto } from "./dto/create-help.dto";
import { CreateDonorDto } from "./dto/create-donor.dto";
import { DonorsDto } from "./dto/donors.dto";
import { DonationsDto } from "./dto/donations.dto";
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
}