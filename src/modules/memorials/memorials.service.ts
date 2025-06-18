import { Injectable } from '@nestjs/common';
import { MemorialsRepository } from './models/memorials.repository';
import { ResponseService } from 'src/shared/response/response.service';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { NotFoundCustomException } from 'src/common/http';
import { MemorialMapper } from './memorials.mapper';
import { PaginationRequest } from 'src/helpers/pagination';
import { CreateMemorialDto } from './dto/create-memorial.dto';

@Injectable()
export class MemorialsService {
  constructor(
    private readonly memorialsRepository: MemorialsRepository,
    private readonly responseService: ResponseService,
  ) {}

  async createMemorial(dto: CreateMemorialDto) {
    try {
      const memorial = MemorialMapper.toCreateMemorialEntity(dto);
      await this.memorialsRepository.save(memorial);
      return this.responseService.makeResponse({
        message: `Memorial created`,
        payload: null
      });
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }

  async getMemorialsShort() {
    try {
      const memorials = await this.memorialsRepository.find();
      // You may want to move the mapping logic to a MemorialsMapper in the future
      const memorialDtos = MemorialMapper.toMemorialsShortList(memorials);
      return this.responseService.makeResponse({
        message: `Memorials retrieved`,
        payload: memorialDtos
      });
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }

  async getMemorialById(memorialId: string) {
    try {
      const memorial = await this.memorialsRepository.findOne({ where: { id: memorialId }, relations: ['members'] });
      if (!memorial) {
        throw new NotFoundCustomException(`This Memorial was not found or its temporary deleted`);
      }
      return this.responseService.makeResponse({
        message: `Memorial retrieved`,
        payload: MemorialMapper.toMemorialDto(memorial)
      });
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }

  async getMemorials(pagination: PaginationRequest) {
    try {
      const memorials = await this.memorialsRepository.find({
        relations: ['members', 'families']
      });
      const memorialDtos = MemorialMapper.toMemorialsListDto(memorials);
      // You may want to move the pagination logic to a helper or MemorialsMapper
      const itemCount = memorialDtos.length;
      const totalPages = Math.ceil(itemCount / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedItems = memorialDtos.slice(startIndex, endIndex);
      const paginatedResponse = {
        items: paginatedItems,
        itemCount: paginatedItems.length,
        totalItems: itemCount,
        itemsPerPage: pagination.limit,
        totalPages,
        currentPage: pagination.page,
      };
      return this.responseService.makeResponse({
        message: `Memorials retrieved`,
        payload: paginatedResponse
      });
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }

  async getMemorialMembers(id: string, pagination: PaginationRequest) {
    try {
      const memorial = await this.memorialsRepository.findOne({
        where: { id },
        relations: ['members.family']
      });
      if (!memorial) {
        throw new NotFoundCustomException(`This memorial was not found or its temporary deleted`);
      }
      const membersDtos = MemorialMapper.mapMemorialMembersList(memorial.members);
      // You may want to move the pagination logic to a helper or MemorialsMapper
      const itemCount = membersDtos.length;
      const totalPages = Math.ceil(itemCount / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedItems = membersDtos.slice(startIndex, endIndex);
      const paginatedResponse = {
        items: paginatedItems,
        itemCount: paginatedItems.length,
        totalItems: itemCount,
        itemsPerPage: pagination.limit,
        totalPages,
        currentPage: pagination.page,
      };
      return this.responseService.makeResponse({
        message: `Memorial members retrieved`,
        payload: paginatedResponse
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async updateMemorial(id: string, dto: any) {
    try {
      const memorial = await this.memorialsRepository.findOne({ where: { id } });
      if (!memorial) {
        throw new NotFoundCustomException(`This Memorial was not found or its temporary deleted`);
      }
      await this.memorialsRepository.update(id, dto);
      return this.responseService.makeResponse({
        message: `Memorial updated successfully`,
        payload: null
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async deleteMemorial(id: string) {
    try {
      const memorial = await this.memorialsRepository.findOne({ where: { id } });
      if (!memorial) {
        throw new NotFoundCustomException(`This Memorial was not found or its temporary deleted`);
      }
      await this.memorialsRepository.delete(id);
      return this.responseService.makeResponse({
        message: `Memorial deleted successfully`,
        payload: null
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }
} 