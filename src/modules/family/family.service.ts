import { Injectable } from '@nestjs/common';
import { FamilyRepository } from './models/family.repository';
import { MembersRepository } from './models/members.repository';
import { CreateFamilyDto } from './dto/create-family.dto';
import { ResponseDto } from 'src/common/dtos';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseService } from 'src/shared/response/response.service';
import { FamilyMapper } from './family.mapper';
@Injectable()
export class FamilyService {

    constructor(
        private readonly familyRepository: FamilyRepository,
        private readonly membersRepository: MembersRepository,
        private readonly responseService: ResponseService
    ){}

    async createFamily(
        dto: CreateFamilyDto
    ): Promise<ResponseDto<string>> {
        try{
            const familyEntity = FamilyMapper.toCreateEntity(dto);
            const savedFamily = await this.familyRepository.save(familyEntity);
            const members = FamilyMapper.mapMembers(dto, savedFamily.id);
            await Promise.all([
                this.membersRepository.save(members)
            ])
            return this.responseService.makeResponse({
                message: `Successfully created the family`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

}