import { Injectable } from '@nestjs/common';
import { MembersRepository } from './models/members.repository';
import { ResponseDto } from 'src/common/dtos';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseService } from 'src/shared/response/response.service';
import { MemberMapper } from './member.mapper';
import { Logger } from '@nestjs/common';
import { NotFoundCustomException } from 'src/common/http';
import { CreateMemberDto } from './dto/create-member.dto';
import { MembersEntity } from './models/members.entity';
import { FilesService } from '../files/files.service';
import { IbukaMemberDto } from './dto/ibuka-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
@Injectable()
export class MemberService {

    constructor(
        private readonly membersRepository: MembersRepository,
        private readonly responseService: ResponseService,
        private readonly filesService: FilesService,
    ) { }

    private readonly logger = new Logger(MemberService.name);



async getIbukaMembers(filter: { params?: any; pagination: { page: number; limit: number } }): Promise<ResponseDto<PaginationResponseDto<IbukaMemberDto>>> {
  try {
    const {
      orphans,
      widows,
      widowers,
      solitary,
      search,
      sector,
      testimonials,
    } = filter.params || {};

    const { page, limit } = filter.pagination;

    const query = this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.family', 'family')
      .leftJoinAndSelect('family.members', 'family_member')
      .leftJoinAndSelect('member.testimonials', 'testimonials')
      .where('member.familyId IS NOT NULL');

    if (orphans) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND (fm.role = :father OR fm.role = :mother))',
        { father: 'FATHER', mother: 'MOTHER' }
      );
    }

    if (widows) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND fm.role = :father)',
        { father: 'FATHER' }
      );
    }

    if (widowers) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND fm.role = :mother)',
        { mother: 'MOTHER' }
      );
    }

    if (solitary) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId)'
      );
    }

    if (sector) {
      query.andWhere('member.current_sector ILIKE :sector', {
        sector: `%${sector}%`,
      });
    }

    if (search) {
      query.andWhere('(member.name ILIKE :search OR member.national_id ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (testimonials === true) {
      query.andWhere('testimonials.id IS NOT NULL');
    }

    if (testimonials === false) {
      query.andWhere('testimonials.id IS NULL');
    }

    const allMembers = await query.getMany();
    const memberDtos = MemberMapper.toIbukaMembersDtoList(allMembers);

    const itemCount = memberDtos.length;
    const totalPages = Math.ceil(itemCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = memberDtos.slice(startIndex, endIndex);

    const responsePayload = {
      items: paginatedItems,
      itemCount: paginatedItems.length,
      totalItems: itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return this.responseService.makeResponse({
      message: 'Ibuka Members retrieved',
      payload: responsePayload,
    });
  } catch (error) {
    console.log(error.stack);
    throw new CustomException(error);
  }
}






    async addMemberToFamily(familyId: string, memberDto: CreateMemberDto): Promise<ResponseDto<string>> {
        try {
            const urls: string[] = [];

            for (const fileId of memberDto.pictures || []) {
              const fileRes = await this.filesService.getFileById(fileId, true) as any;
              if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                urls.push(fileRes.url);
              }
            }
            
            memberDto.pictures = urls;
            
            const memberEntity = MemberMapper.mapSingleMember(memberDto, familyId);
            await this.membersRepository.save(memberEntity);
            return this.responseService.makeResponse({
                message: 'Successfully added member to the family',
                payload: null,
            });
        } catch (error) {
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        }
    }

    async getMemberById(memberId: string): Promise<ResponseDto<MembersEntity>> {
        try {
            const member = await this.membersRepository.findOne({ where: { id: memberId } });
            if (!member) {
                throw new NotFoundCustomException('Member not found');
            }
            return this.responseService.makeResponse({
                message: 'Successfully retrieved member',
                payload: member,
            });
        } catch (error) {
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        }
    }

    async deleteMember(memberId: string): Promise<ResponseDto<string>> {
        try {
            const result = await this.membersRepository.delete({ id: memberId });
            if (result.affected === 0) {
                throw new NotFoundCustomException('Member not found or already deleted');
            }
            return this.responseService.makeResponse({
                message: 'Successfully deleted member',
                payload: null,
            });
        } catch (error) {
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        }
    }

    async updateMember(id: string, updateDto: UpdateMemberDto): Promise<ResponseDto<string>> {
        try {
            const member = await this.membersRepository.findOne({ where: { id } });
            if (!member) {
                throw new NotFoundCustomException('Member not found');
            }
            await this.membersRepository.update(id, updateDto);
            return this.responseService.makeResponse({
                message: 'Member updated successfully',
                payload: null,
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async getMembersByFamily(familyId: string): Promise<ResponseDto<MembersEntity[]>> {
        try {
            const members = await this.membersRepository.find({ where: { familyId } });
            return this.responseService.makeResponse({
                message: 'Members retrieved successfully',
                payload: members,
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

}