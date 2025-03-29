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
@Injectable()
export class HelpingService {
    constructor(
        private readonly donorRepository: DonorRepository,
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
}