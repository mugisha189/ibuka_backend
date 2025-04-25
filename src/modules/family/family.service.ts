import { Injectable } from '@nestjs/common';
import { FamilyRepository } from './models/family.repository';
import { MembersRepository } from './models/members.repository';
import { CreateFamilyDto } from './dto/create-family.dto';
import { CreateTestimonialsDto } from './dto/create-testimonials.dto';
import { ResponseDto } from 'src/common/dtos';
import { TestimonialsRepository } from './models/testimonials.repository';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseService } from 'src/shared/response/response.service';
import { FamilyMapper } from './family.mapper';
import { PaginationRequest } from 'src/helpers/pagination';
import { FamilyResponseDto } from './dto/family-response.dto';
import { Logger } from '@nestjs/common';
import { MemorialsRepository } from './models/memorials.repository';
import { In } from 'typeorm';
import { NotFoundCustomException } from 'src/common/http';
import { FamilyProp } from './dto/family-prop.dto';
import { MemorialsResponseDto } from './dto/memorials-response.dto';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { EFamilyStatus } from './enum/family-status.enum';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { FamilyEntity } from './models/family.entity';
import { MemorialShortDto } from './dto/memorial-short.dto';
import { FamilyStructureDto } from './dto/family-structure.dto';
import { MemorialMembersResponseDto } from './dto/memorial-member-response.dto';
import { MemorialResponseDto } from './dto/memorial-response.dto';
import { TestimonialsDto } from './dto/testimonials.dto';
import { IbukaMemberDto } from './dto/ibuka-member.dto';
@Injectable()
export class FamilyService {

    constructor(
        private readonly familyRepository: FamilyRepository,
        private readonly membersRepository: MembersRepository,
        private readonly responseService: ResponseService,
        private readonly memorialsRepository: MemorialsRepository,
        private readonly testimonialsRepository: TestimonialsRepository
    ){}

    private readonly logger = new Logger(FamilyService.name);

    private getPaginatedResponseFamilies<T>(items: any[], pagination: PaginationRequest): PaginationResponseDto<T> {
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

        private validateEnumType<T>(
              value: string,
              enumType: T,
              fieldName: string,
              logger: Logger
            ): string | null {
              if(Object.values(enumType).includes(value as T)){
                return value;
              }else{
                logger.debug(`Invalid value for ${fieldName} ${value}`);
                return null;
              }
            }

            private isMatch(fieldName: string, filterValue: string): boolean {
                return fieldName === filterValue;
              }

            private isAlmostMatch(fieldName: string, filterValue: string): boolean {
                const similarityThreshold = 0.88;
                const str1 = fieldName.toLowerCase();
                const str2 = filterValue.toLowerCase();
            
                const calculateLevenshteinDistance = (a: string, b: string): number => {
                    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
                        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
                    );
                    for (let i = 1; i <= a.length; i++) {
                        for (let j = 1; j <= b.length; j++) {
                            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                            matrix[i][j] = Math.min(
                                matrix[i - 1][j] + 1,
                                matrix[i][j - 1] + 1,
                                matrix[i - 1][j - 1] + cost
                            );
                        }
                    }
                    return matrix[a.length][b.length];
                };
                const levenshteinDistance = calculateLevenshteinDistance(str1, str2);
                const maxLength = Math.max(str1.length, str2.length);
                const similarity = 1 - levenshteinDistance / maxLength;
                return similarity >= similarityThreshold;
            }
        
            private filterFamilies(families: FamilyEntity[], filters: any): FamilyEntity[] {
                const {
                  search, disseised_families,
                  survived_families, testimonial_families
                } = filters;
                const isAnyActive = !search &&
                !disseised_families && !survived_families &&
                !testimonial_families
                if(isAnyActive){
                  return families;
                }
                return families.filter((family) => {
                  return (
                    (
                        search &&
                        (search !== '' || search !== null || search !== undefined) &&
                        [
                            family.former_district,
                            family.former_sector,
                            family.former_cell,
                            family.former_village
                        ].some(field => this.isMatch(field, search) || this.isAlmostMatch(field, search))
                    ) ||
                    (disseised_families && (disseised_families !== '' || disseised_families !== undefined) && (this.isMatch(family.status, disseised_families))) ||
                    (survived_families && (survived_families !== '' || survived_families !== undefined) && (this.isMatch(family.status, survived_families))) ||
                    (testimonial_families && (testimonial_families !== '' || testimonial_families !== undefined) && (family.testimonials?.length > 0))
                  )
                })
              }

    async getFamilies(
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<FamilyResponseDto>>> {
        try {
            const {
                search = pagination.params?.search ?? '',
                disseised_families = (pagination.params?.disseised_families && this.validateEnumType(pagination.params.disseised_families, EFamilyStatus, 'disseised families', this.logger)) ?? '',
                survived_families = (pagination.params?.survived_families && this.validateEnumType(pagination.params.survived_families, EFamilyStatus, 'survived families', this.logger)) ?? '',
                testimonial_families = pagination.params?.testimonial_families ?? ''
            } = pagination.params || {};

            const families = await this.familyRepository.find({
                relations: ['members', 'testimonials']
            });
            const filteredFamilies = this.filterFamilies(families,  { search, disseised_families, survived_families, testimonial_families })
            const familyDtos = FamilyMapper.toFamilyDtoList(filteredFamilies);
            const paginatedResponse = this.getPaginatedResponseFamilies(familyDtos, pagination);
            return this.responseService.makeResponse({
                message: `Families retrieved`,
                payload: paginatedResponse
            })
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async getFamily(
        familyId: string
    ) : Promise<ResponseDto<FamilyProp>> {
        try{
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members']});
            if(!family){
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }
            const familyProp = FamilyMapper.toFamilyDtoPropertie(family);
            return this.responseService.makeResponse({
                message: `Family retrieved successfully`,
                payload: familyProp
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMemorialsShort(): Promise<ResponseDto<MemorialShortDto[]>> {
        try{
            const memorials = await this.memorialsRepository.find();
            const memorialDtos = FamilyMapper.toMemorialsShortList(memorials);
            return this.responseService.makeResponse({
                message: `Memorials retrieved`,
                payload: memorialDtos
            })
        }catch(error){
            throw new CustomException(error);
        }
    }
    

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
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        }
    }

    async createMemorial(
        dto: CreateMemorialDto
    ): Promise<ResponseDto<string>> {
        try{
            const memorial = FamilyMapper.toCreateMemorialEntity(dto);
            await this.memorialsRepository.save(memorial);
            return this.responseService.makeResponse({
                message: `Memorial created`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async deleteFamily(
        id: string
    ): Promise<ResponseDto<string>> {
        try{
            const family = await this.familyRepository.findOne({ where: { id: id, status: In([EFamilyStatus.ACTIVE, EFamilyStatus.DISSEISED]) }})
            if(!family){
                throw new NotFoundCustomException(`Family ${id} not found or might have been deleted`);
            }
            await this.familyRepository.update(id, { status: EFamilyStatus.DELETED });
            return this.responseService.makeResponse({
                message: `Family has been deleted`,
                payload: null
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async createTestimonial(
        dto: CreateTestimonialsDto
    ): Promise<ResponseDto<string>> {
        try{
            const testimonial = FamilyMapper.toCreateTestimonialsEntity(dto);
            await this.testimonialsRepository.save(testimonial);
            return this.responseService.makeResponse({
                message: `Your testimonial has been added`,
                payload: null
            })
        }catch(error){
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        }
    }

    async getTestimonialsByFamily(
        familyId: string
    ): Promise<ResponseDto<TestimonialsDto[]>> {
        try{
            const testimonials = await this.testimonialsRepository.find({
                where: { familyId }
            })
            if(!testimonials){
                return this.responseService.makeResponse({
                    message: `No testimonials found for this family`,
                    payload: []
                })
            }
            const testimonialDtos = FamilyMapper.toTestimonialsDtoList(testimonials);
            return this.responseService.makeResponse({
                message: `Testimonials retrieved`,
                payload: testimonialDtos
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getTestimonialsByMember(
        id: string
    ): Promise<ResponseDto<TestimonialsDto[]>> {
        try{
            const testimonials = await this.testimonialsRepository.find({
                where: { memberId: id }
            })
            if(!testimonials){
                return this.responseService.makeResponse({
                    message: `No testimonials found for this member`,
                    payload: []
                })
            }
            const testimonialDtos = FamilyMapper.toTestimonialsDtoList(testimonials);
            return this.responseService.makeResponse({
                message: `Testimonials retrieved`,
                payload: testimonialDtos
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMemorialById(
        memorialId: string
    ): Promise<ResponseDto<MemorialResponseDto>> {
        try{
            const memorial = await this.memorialsRepository.findOne({ where: { id: memorialId }, relations: ['members']});
            if(!memorial){
                throw new NotFoundCustomException(`This Memorial was not found or its temporary deleted`);
            }
            return this.responseService.makeResponse({
                message: `Memorial retrieved`,
                payload: FamilyMapper.toMemorialDto(memorial)
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getFamilyStructure(
        familyId: string
    ): Promise<ResponseDto<FamilyStructureDto>> {
        try{
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members']});
            if(!family){
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }
            const familyStructureDto = await FamilyMapper.toDtoFamilyStructure(family);
            return this.responseService.makeResponse({
                message: `Family Structure retrieved`,
                payload: familyStructureDto
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMemorials(
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<MemorialsResponseDto>>> {
        try{
            // const {
            //     search = pagination.params?.search ?? ''
            // } = pagination.params || {}
            const memorials = await this.memorialsRepository.find({
                relations: ['members', 'families']
            })
            const memorialDtos = FamilyMapper.toMemorialsListDto(memorials);
            const paginatedResponse = this.getPaginatedResponseFamilies(memorialDtos, pagination);
            return this.responseService.makeResponse({
                message: `Memorials retrieved`,
                payload: paginatedResponse
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getMemorialMembers(
        id: string,
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<MemorialMembersResponseDto>>> {
        try{
            const memorial = await this.memorialsRepository.findOne({
                where: { id },
                relations: ['members.family']
            })
            if(!memorial){
                throw new NotFoundCustomException(`This memorial was not found or its temporary deleted`);
            }
            const membersDtos = FamilyMapper.mapMemorialMembersList(memorial.members);
            const paginatedResponse = this.getPaginatedResponseFamilies(membersDtos, pagination);
            return this.responseService.makeResponse({
                message: `Memorial members retrieved`,
                payload: paginatedResponse
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getIbukaMembers(
        filter: { params?: any }
    ): Promise<ResponseDto<IbukaMemberDto[]>> {
        try{
            const {
                orphans = filter.params?.orphans,
                widows = filter.params?.widows,
                widowers = filter.params?.widowers,
                solitary = filter.params?.solitary,
            } = filter.params || {};
            const query = this.membersRepository.createQueryBuilder('member')
            .leftJoinAndSelect('family', 'family')
            .leftJoinAndSelect('family.members', 'family_member')
            .where('member.familyId IS NOT NULL');

            if (orphans) {
            query.andWhere('NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND (fm.role = :father OR fm.role = :mother))', { father: 'FATHER', mother: 'MOTHER' });
            }

            if (widows) {
            query.andWhere('NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND fm.role = :father)', { father: 'FATHER' });
            }

            if (widowers) {
            query.andWhere('NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId AND fm.role = :mother)', { mother: 'MOTHER' });
            }

            if (solitary) {
            query.andWhere('NOT EXISTS (SELECT 1 FROM family_member fm WHERE fm.familyId = member.familyId)', {});
            }
            const members = await query.getMany();

            const memberDtos = FamilyMapper.toIbukaMembersDtoList(members);
            // const paginatedResponse = this.getPaginatedResponseFamilies(memberDtos, pagination);
            return this.responseService.makeResponse({
                message: `Ibuka Members retrieved`,
                payload: memberDtos
            })
        }catch(error){
            console.log(error.stack);
            throw new CustomException(error);
        }
    }

}