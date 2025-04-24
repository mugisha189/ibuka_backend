import { Injectable } from '@nestjs/common';
import { HelpingMapper } from './helping.mapper';
import { HelpingRepository } from './model/helping.repository';
import { DonorRepository } from './model/donor.repository';
import { CreateHelpRequestDto } from './dto/create-help-req.dto';
import { CreateDonorDto } from './dto/create-donor.dto';
import { ResponseService } from 'src/shared/response/response.service';
import { ResponseDto } from 'src/common/dtos';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { PaginationRequest } from 'src/helpers/pagination';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { DonorsResponseDto } from './dto/donors-response.dto';
import { DonationResponseDto } from './dto/donations-response.dto';
import { NotFoundCustomException } from 'src/common/http';
import { HelpingResponseDto } from './dto/helping-response.dto';
import { UpdateHelpingDto } from './dto/update-helping.dto';
import { In } from 'typeorm';
import { FamilyRepository } from '../family/models/family.repository';
import { MembersRepository } from '../family/models/members.repository';
import { MembersShortDto } from './dto/members-short.dto';
@Injectable()
export class HelpingService {
    constructor(
        private readonly donorRepository: DonorRepository,
        private readonly familyRepository: FamilyRepository,
        private readonly membersRepository: MembersRepository,
        private readonly helpingRepository: HelpingRepository,
        private readonly responseService: ResponseService
    ){}

    private getPaginatedResponseDonors<T>(items: any[], pagination: PaginationRequest): PaginationResponseDto<T> {
        const itemCount = items.length;
        const totalPages = Math.ceil(itemCount / pagination.limit);
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedItems = items.slice(startIndex, endIndex);
        return {
          items: paginatedItems,
          itemCount: paginatedItems.length,
          totalItems: itemCount,
          itemsPerPage: pagination.limit,
          totalPages,
          currentPage: pagination.page,
        };
      }

    async getDonors(
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<DonorsResponseDto>>> {
        try{
            const donors = await this.donorRepository.find({
                relations: ['helping']
            })
            const donorDtos = HelpingMapper.toDtoDonorsList(donors);
            const paginatedResponse = this.getPaginatedResponseDonors(donorDtos, pagination);
            return this.responseService.makeResponse({
                message: `Donors retrieved`,
                payload: paginatedResponse
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getDonorById(
        id: string,
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<DonationResponseDto>>> {
        try{
            const donor = await this.donorRepository.findOne({ where: { id }, relations: ['helping']});
            if(!donor){
                throw new NotFoundCustomException(`The Specified donor might be temporary inactive`);
            }
            const donations = HelpingMapper.toDtoDonationsList(donor.helping);
            const paginatedResponse = this.getPaginatedResponseDonors(donations, pagination);
            return this.responseService.makeResponse({
                message: `Donations retrieved`,
                payload: paginatedResponse
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async createDonor(
        dto: CreateDonorDto
    ): Promise<ResponseDto<string>> {
        try{
            const donor = HelpingMapper.toDonorEntity(dto);
            await this.donorRepository.save(donor);
            return this.responseService.makeResponse({
                message: `Saved the Donor`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async createHelping(dto: CreateHelpRequestDto): Promise<ResponseDto<string>> {
        try{
            const helpings = HelpingMapper.toHelpingEntities(dto);
            await Promise.all([
                this.helpingRepository.save(helpings)
            ])
            return this.responseService.makeResponse({
                message: `Helping created`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getHelping(
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<HelpingResponseDto>>> {
        try{
            const helpings = await this.helpingRepository.find({
                relations: ['members', 'families', 'donor']
            })
            if(!helpings){
                throw new NotFoundCustomException(`No donations or helpings have been given currently`);
            }
            const helpingDtos = helpings.map(HelpingMapper.toDtoHelpingAll);
            const paginatedResponse = this.getPaginatedResponseDonors(helpingDtos, pagination);
            return this.responseService.makeResponse({
                message: `Helpings retrieved`,
                payload: paginatedResponse
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async updateHelping(
        id: string,
        dto: UpdateHelpingDto
    ): Promise<ResponseDto<string>> {
        try{
            const helping = await this.helpingRepository.findOne({
                where: { id },
                relations: ['families', 'members', 'donor']
            })
            if(!helping){
                throw new NotFoundCustomException(`This helping instance was not found`);
            }
            const isValid = (val: any): boolean => val !== undefined && val !== null && val !== '';

            const assignIfValid = (source: any, target: any, keys: string[]) => {
            for (const key of keys) {
                if (isValid(source[key])) target[key] = source[key];
            }
            };

            assignIfValid(dto, helping, ['amount', 'remaining_amount', 'given_amount']);

            if (isValid(dto.items)) helping.items = dto.items;
            if (isValid(dto.donorId)) helping.donorId = dto.donorId;

            const familiesPromise = Array.isArray(dto.family_beneficiaries) && dto.family_beneficiaries.length > 0
            ? this.familyRepository.find({
                where: { id: In(dto.family_beneficiaries) }
            })
            : Promise.resolve([]);

            const membersPromise = Array.isArray(dto.member_beneficiaries) && dto.member_beneficiaries.length > 0
            ? this.membersRepository.find({
                where: { id: In(dto.member_beneficiaries) }
            })
            : Promise.resolve([]);

            const [families, members] = await Promise.all([familiesPromise, membersPromise]);
            if (families.length > 0) helping.families = families;
            if (members.length > 0) helping.members = members;

            await this.helpingRepository.save(helping);
            return this.responseService.makeResponse({
                message: `Helping information has been updated`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMembersShortByFamily(
        id: string
    ): Promise<ResponseDto<MembersShortDto[]>> {
        try{
            const all_members = await this.membersRepository.find({
                where: { familyId: id },
                select: ['id', 'name', 'createdAt', 'updatedAt']
            })
            if(!all_members){
                return this.responseService.makeResponse({
                    message: `No members found`,
                    payload: []
                })
            }
            const membersShortDtos = HelpingMapper.toDtoMembers(all_members);
            return this.responseService.makeResponse({
                message: `Members retrieved`,
                payload: membersShortDtos
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMembersShort(): Promise<ResponseDto<MembersShortDto[]>> {
        try{
            const all_members = await this.membersRepository.find({
                select: ['id', 'name', 'createdAt', 'updatedAt']
            });
            const membersShortDtos = HelpingMapper.toDtoMembers(all_members);
            return this.responseService.makeResponse({
                message: `Members retrieved`,
                payload: membersShortDtos
            })
        }catch(error){
            throw new CustomException(error);
        }
    }
}