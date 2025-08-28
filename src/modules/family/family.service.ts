import { Injectable } from '@nestjs/common';
import { FamilyRepository } from './models/family.repository';
import { MembersRepository } from '../member/models/members.repository';
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
import { DataSource } from 'typeorm';
@Injectable()
export class FamilyService {

    constructor(
        private readonly familyRepository: FamilyRepository,
        private readonly membersRepository: MembersRepository,
        private readonly responseService: ResponseService,
        private readonly filesService: FilesService,
        private readonly dataSource: DataSource,
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

    /**
     * Helper method to resolve profile pictures from file IDs to URLs
     * @param members Array of members with pictures field
     */
    private async resolveProfilePictures(members: any[]): Promise<void> {
        if (!members || members.length === 0) return;

        await Promise.all(
            members.map(async (member) => {
                if (member.pictures && member.pictures.length > 0) {
                    try {
                        // Resolve each picture ID to URL
                        const pictureUrls = await Promise.all(
                            member.pictures.map(async (pictureId) => {
                                try {
                                    const fileRes = await this.filesService.getFileById(pictureId, true) as any;
                                    if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                                        return fileRes.url;
                                    }
                                    return null;
                                } catch (e) {
                                    this.logger.warn(`Failed to resolve picture ID ${pictureId}: ${e.message}`);
                                    return null;
                                }
                            })
                        );
                        
                        // Filter out null values and update member pictures
                        member.pictures = pictureUrls.filter(url => url !== null);
                    } catch (e) {
                        this.logger.warn(`Failed to resolve pictures for member ${member.id}: ${e.message}`);
                        member.pictures = [];
                    }
                }
            })
        );
    }

    /**
     * Helper method to resolve testimonial files from file IDs to URLs
     * @param testimonials Array of testimonials with testimonial_files field
     */
    private async resolveTestimonialFiles(testimonials: any[]): Promise<void> {
        if (!testimonials || testimonials.length === 0) return;

        await Promise.all(
            testimonials.map(async (testimonial) => {
                if (testimonial.testimonial_files && testimonial.testimonial_files.length > 0) {
                    try {
                        // Resolve each file ID to URL
                        const fileUrls = await Promise.all(
                            testimonial.testimonial_files.map(async (fileId) => {
                                try {
                                    const fileRes = await this.filesService.getFileById(fileId, true) as any;
                                    if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                                        return fileRes.url;
                                    }
                                    return null;
                                } catch (e) {
                                    this.logger.warn(`Failed to resolve file ID ${fileId}: ${e.message}`);
                                    return null;
                                }
                            })
                        );
                        
                        // Filter out null values and update testimonial files
                        testimonial.testimonial_files = fileUrls.filter(url => url !== null);
                    } catch (e) {
                        this.logger.warn(`Failed to resolve files for testimonial ${testimonial.id}: ${e.message}`);
                        testimonial.testimonial_files = [];
                    }
                }
            })
        );
    }





    async getFamilies(
        pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<FamilyResponseDto>>> {
        try {
            const {
                search = pagination.params?.search ?? '',
                deceased_families = (pagination.params?.deceased_families && this.validateEnumType(pagination.params.deceased_families, EFamilyStatus, 'deceased families', this.logger)) ?? '',
                survived_families = (pagination.params?.survived_families && this.validateEnumType(pagination.params.survived_families, EFamilyStatus, 'survived families', this.logger)) ?? '',
                testimonial_families = pagination.params?.testimonial_families ?? '',
                sector = pagination.params?.sector ?? '',
                survivors = pagination.params?.survivors !== undefined ? Number(pagination.params.survivors) : undefined,
                testimonials = pagination.params?.testimonials !== undefined ? Number(pagination.params.testimonials) : undefined,
            } = pagination.params || {};

            
            // Build database query with all filters
            const queryBuilder = this.familyRepository
                .createQueryBuilder('family')
                .leftJoinAndSelect('family.members', 'members')
                .leftJoinAndSelect('family.testimonials', 'testimonials');

            // Apply search filter
            if (search && search.trim() !== '') {
                queryBuilder.where(
                    'family.family_name ILIKE :search OR ' +
                    'family.former_province ILIKE :search OR ' +
                    'family.former_district ILIKE :search OR ' +
                    'family.former_sector ILIKE :search OR ' +
                    'family.former_cell ILIKE :search OR ' +
                    'family.former_village ILIKE :search OR ' +
                    'members.current_district ILIKE :search OR ' +
                    'members.current_sector ILIKE :search OR ' +
                    'members.current_cell ILIKE :search OR ' +
                    'members.current_village ILIKE :search OR ' +
                    'members.survival_district ILIKE :search OR ' +
                    'members.survival_sector ILIKE :search OR ' +
                    'members.survival_cell ILIKE :search OR ' +
                    'members.survival_village ILIKE :search',
                    { search: `%${search}%` }
                );
            }

            // Apply status filters
            if (deceased_families && deceased_families !== '') {
                queryBuilder.andWhere('family.status = :deceasedStatus', { deceasedStatus: deceased_families });
            }

            if (survived_families && survived_families !== '') {
                queryBuilder.andWhere('family.status = :survivedStatus', { survivedStatus: survived_families });
            }

            // Apply testimonial filter
            if (testimonial_families && testimonial_families !== '') {
                queryBuilder.andWhere('testimonials.id IS NOT NULL');
            }

            // Apply sector filter
            if (sector && sector !== '') {
                queryBuilder.andWhere(
                    'members.current_sector ILIKE :sector OR members.survival_sector ILIKE :sector',
                    { sector: `%${sector}%` }
                );
            }

            // Apply survivors count filter
            if (typeof survivors === 'number') {
                queryBuilder.andWhere(
                    '(SELECT COUNT(*) FROM members m WHERE m.familyId = family.id AND m.status = :survivedStatus) = :survivorsCount',
                    { survivedStatus: 'SURVIVED', survivorsCount: survivors }
                );
            }

            // Apply testimonials count filter
            if (typeof testimonials === 'number') {
                queryBuilder.andWhere(
                    '(SELECT COUNT(*) FROM testimonials t WHERE t.familyId = family.id) = :testimonialsCount',
                    { testimonialsCount: testimonials }
                );
            }

            // Execute query
            const families = await queryBuilder.getMany();
            
            // Resolve profile pictures and testimonial files for all families
            // Note: This might impact performance for large lists, consider adding a parameter to control this
            for (const family of families) {
                if (family.members && family.members.length > 0) {
                    await this.resolveProfilePictures(family.members);
                }
                if (family.testimonials && family.testimonials.length > 0) {
                    await this.resolveTestimonialFiles(family.testimonials);
                }
            }
            
            const familyDtos = FamilyMapper.toFamilyDtoList(families);
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
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members', 'testimonials'] });
            if (!family) {
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }

            // Resolve profile pictures from file IDs to URLs for all members
            await this.resolveProfilePictures(family.members);
            
            // Resolve testimonial files from file IDs to URLs
            if (family.testimonials && family.testimonials.length > 0) {
                await this.resolveTestimonialFiles(family.testimonials);
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
        // Start database transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const familyEntity = FamilyMapper.toCreateEntity(dto);
            console.log(familyEntity);
            
            // Save family within transaction
            const savedFamily = await queryRunner.manager.save(FamilyEntity, familyEntity);
            
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

            // Save members within transaction
            await queryRunner.manager.save('MembersEntity', members);

            // If everything succeeds, commit the transaction
            await queryRunner.commitTransaction();

            return this.responseService.makeResponse({
                message: `Successfully created the family`,
                payload: null
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await queryRunner.rollbackTransaction();
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }


    async updateFamily(familyId: string, dto: UpdateFamilyDto): Promise<ResponseDto<string>> {
        // Start database transaction for update operations
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingFamily = await queryRunner.manager.findOne(FamilyEntity, { where: { id: familyId } });
            if (!existingFamily) {
                throw new NotFoundCustomException('Family not found');
            }

            const updatedFamily = queryRunner.manager.merge(FamilyEntity, existingFamily, dto);
            await queryRunner.manager.save(FamilyEntity, updatedFamily);

            // If everything succeeds, commit the transaction
            await queryRunner.commitTransaction();

            return this.responseService.makeResponse({
                message: 'Successfully updated family',
                payload: null,
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await queryRunner.rollbackTransaction();
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

    async deleteFamily(familyId: string): Promise<ResponseDto<string>> {
        // Start database transaction for delete operations
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingFamily = await queryRunner.manager.findOne(FamilyEntity, { where: { id: familyId } });
            if (!existingFamily) {
                throw new NotFoundCustomException('Family not found');
            }
            
            // Delete family (cascade will handle related members and testimonials)
            await queryRunner.manager.delete(FamilyEntity, { id: familyId });

            // If everything succeeds, commit the transaction
            await queryRunner.commitTransaction();

            return this.responseService.makeResponse({
                message: 'Successfully deleted family',
                payload: null,
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await queryRunner.rollbackTransaction();
            console.log('the error stack is: ' + error.stack);
            throw new CustomException(error);
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

    async getFamilyStructure(
        familyId: string
    ): Promise<ResponseDto<FamilyStructureDto>> {
        try {
            const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members', 'testimonials'] });
            if (!family) {
                throw new NotFoundCustomException(`Family ${familyId} not found`);
            }

            // Resolve profile pictures from file IDs to URLs for all members
            await this.resolveProfilePictures(family.members);
            
            // Resolve testimonial files from file IDs to URLs
            if (family.testimonials && family.testimonials.length > 0) {
                await this.resolveTestimonialFiles(family.testimonials);
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