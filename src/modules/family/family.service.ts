import { Injectable } from '@nestjs/common';
import { FamilyRepository } from './models/family.repository';
import { MembersRepository } from './models/members.repository';
import { CreateFamilyDto } from './dto/create-family.dto';
import { ResponseDto } from 'src/common/dtos';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseService } from 'src/shared/response/response.service';
import { FamilyMapper } from './family.mapper';
import { PaginationRequest } from 'src/helpers/pagination';
import { FamilyResponseDto } from './dto/family-response.dto';
import { Logger } from '@nestjs/common';
import { NotFoundCustomException } from 'src/common/http';
import { FamilyProp } from './dto/family-prop.dto';
import { EFamilyStatus } from './enum/family-status.enum';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { FamilyEntity } from './models/family.entity';
import { FamilyStructureDto } from './dto/family-structure.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FilesService } from '../files/files.service';
@Injectable()
export class FamilyService {

    constructor(
        private readonly familyRepository: FamilyRepository,
        private readonly membersRepository: MembersRepository,
        private readonly responseService: ResponseService,
        private readonly filesService: FilesService,
    ) { }

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
        if (Object.values(enumType).includes(value as T)) {
            return value;
        } else {
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
            search, deceased_families,
            survived_families, testimonial_families
        } = filters;
        const isAnyActive = !search &&
            !deceased_families && !survived_families &&
            !testimonial_families
        if (isAnyActive) {
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
                (deceased_families && (deceased_families !== '' || deceased_families !== undefined) && (this.isMatch(family.status, deceased_families))) ||
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
                deceased_families = (pagination.params?.deceased_families && this.validateEnumType(pagination.params.deceased_families, EFamilyStatus, 'deceased families', this.logger)) ?? '',
                survived_families = (pagination.params?.survived_families && this.validateEnumType(pagination.params.survived_families, EFamilyStatus, 'survived families', this.logger)) ?? '',
                testimonial_families = pagination.params?.testimonial_families ?? ''
            } = pagination.params || {};

            const families = await this.familyRepository.find({
                relations: ['members', 'testimonials']
            });
            const filteredFamilies = this.filterFamilies(families, { search, deceased_families, survived_families, testimonial_families })
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
    ): Promise<ResponseDto<FamilyProp>> {
        try {
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members'] });
            if (!family) {
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }
            const familyProp = FamilyMapper.toFamilyDtoPropertie(family);
            return this.responseService.makeResponse({
                message: `Family retrieved successfully`,
                payload: familyProp
            })
        } catch (error) {
            throw new CustomException(error);
        }
    }



    async createFamily(
        dto: CreateFamilyDto
    ): Promise<ResponseDto<string>> {
        try {
            const familyEntity = FamilyMapper.toCreateEntity(dto);
            console.log(familyEntity)
            const savedFamily = await this.familyRepository.save(familyEntity);
            // Map members and resolve profile_picture from file ID to file URL
            const members = await Promise.all(
                dto.members.map(async (member) => {
                    let profile_picture = null;
                    if (member.profile_picture) {
                        try {
                            const fileRes = await this.filesService.getFileById(member.profile_picture, true) as any;
                            if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                                profile_picture = fileRes.url;
                            }
                        } catch (e) {
                            profile_picture = null;
                        }
                    }
                    return { ...member, familyId: savedFamily.id, profile_picture };
                })
            );
            await Promise.all([
                this.membersRepository.save(members)
            ])
            return this.responseService.makeResponse({
                message: `Successfully created the family`,
                payload: null
            })
        } catch (error) {
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        }
    }


    async updateFamily(familyId: string, dto: UpdateFamilyDto): Promise<ResponseDto<string>> {
        try {
            const existingFamily = await this.familyRepository.findOne({ where: { id: familyId } });
            if (!existingFamily) {
                throw new NotFoundCustomException('Family not found');
            }

            const updatedFamily = this.familyRepository.merge(existingFamily, dto);
            await this.familyRepository.save(updatedFamily);

            return this.responseService.makeResponse({
                message: 'Successfully updated family',
                payload: null,
            });
        } catch (error) {
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        }
    }

    async deleteFamily(familyId: string): Promise<ResponseDto<string>> {
        try {
            const existingFamily = await this.familyRepository.findOne({ where: { id: familyId } });
            if (!existingFamily) {
                throw new NotFoundCustomException('Family not found');
            }
            await this.familyRepository.delete({ id: familyId });
            return this.responseService.makeResponse({
                message: 'Successfully deleted family',
                payload: null,
            });
        } catch (error) {
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        }
    }

    async getFamilyStructure(
        familyId: string
    ): Promise<ResponseDto<FamilyStructureDto>> {
        try {
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members'] });
            if (!family) {
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }
            const familyStructureDto = await FamilyMapper.toDtoFamilyStructure(family);
            return this.responseService.makeResponse({
                message: `Family Structure retrieved`,
                payload: familyStructureDto
            })
        } catch (error) {
            throw new CustomException(error);
        }
    }

}