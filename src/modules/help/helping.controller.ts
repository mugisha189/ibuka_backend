import { Controller, Post, ValidationPipe, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TOKEN_NAME } from 'src/constants';
import { HelpingService } from './helping.service';
import { CreateHelpRequestDto } from './dto/create-help-req.dto';
import { ResponseDto } from 'src/common/dtos';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { CreateDonorDto } from './dto/create-donor.dto';
import { DonorsResponseDto } from './dto/donors-response.dto';
import { PaginationParams } from 'src/helpers/pagination';
import { ApiOkPaginatedResponse } from 'src/helpers/pagination';
import { DonationsDto } from './dto/donations.dto';
import { PaginationRequest } from 'src/helpers/pagination';
import { DonorsDto } from './dto/donors.dto';
import { HelpingDto } from './dto/helping.dto';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { DonationResponseDto } from './dto/donations-response.dto';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { HelpingResponseDto } from './dto/helping-response.dto';
import { UpdateHelpingDto } from './dto/update-helping.dto';
import { MembersShortDto } from './dto/members-short.dto';
@Controller({
    path: 'helping',
    version: '1'
})

@ApiTags('Helping')
export class HelpingController {
    constructor(
        private readonly helpingService: HelpingService
    ){}

    @ApiOperation({ description: 'Get Donors' })
    @ApiOkPaginatedResponse(DonorsDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/donors/all')
    public getDonors(
        @PaginationParams() pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<DonorsResponseDto>>> {
        return this.helpingService.getDonors(pagination);
    }

    @ApiOperation({ description: 'Get donations by a donor' })
    @ApiOkPaginatedResponse(DonationsDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/donations/:id')
    public getDonations(
        @Param('id') id: string,
        @PaginationParams() pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<DonationResponseDto>>> {
        return this.helpingService.getDonorById(id, pagination);
    }


    @ApiOperation({ description: 'Create Helping' })
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Post('/add')
    public createHelping(
        @Body(ValidationPipe) dto: CreateHelpRequestDto
    ): Promise<ResponseDto<string>> {  
        return this.helpingService.createHelping(dto);
    } 

    @ApiOperation({ description: 'Get the Helpings' })
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @ApiOkCustomResponse(HelpingDto)
    @Get('/all')
    public getHelpings(
        @PaginationParams() pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<HelpingResponseDto>>> {
        return this.helpingService.getHelping(pagination);
    }

    @ApiOperation({ description: 'Get the Helpings' })
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Patch('/update/:id')
    public updateHelping(
        @Param('id') id: string,
        @Body(ValidationPipe) dto: UpdateHelpingDto
    ): Promise<ResponseDto<string>> {
        return this.helpingService.updateHelping(id, dto);
    }

    @ApiOperation({ description: 'Get members short' })
    @ApiOkCustomResponse(MembersShortDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/members/short/family')
    public getMembersShort(): Promise<ResponseDto<MembersShortDto[]>> {
        return this.helpingService.getMembersShort();
    }

    @ApiOperation({ description: 'Get members short' })
    @ApiOkCustomResponse(MembersShortDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/members/short/family/:id')
    public getMembersShortById(
        @Param('id') id: string
    ): Promise<ResponseDto<MembersShortDto[]>> {
        return this.helpingService.getMembersShortByFamily(id);
    }


    @ApiOperation({ description: 'Create Donor' })
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Post('/donor/add')
    public createDonor(
        @Body(ValidationPipe) dto: CreateDonorDto
    ): Promise<ResponseDto<string>> {
        return this.helpingService.createDonor(dto);
    }
}