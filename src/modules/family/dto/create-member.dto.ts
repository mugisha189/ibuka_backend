import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { EMemberRole, EMemberStatus } from "../enum";
export class CreateMemberDto {
    
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    national_id?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    birth_date?: string;

    @ApiProperty({
        required: true,
        enum: Object.values(EMemberRole)
    })
    @IsNotEmpty()
    @IsEnum(EMemberRole)
    role: EMemberRole;

    @ApiProperty({
        required: true,
        enum: Object.values(EMemberStatus)
    })
    @IsNotEmpty()
    @IsEnum(EMemberStatus)
    status: EMemberStatus;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    memorial_site?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    remembrance_day?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    current_district?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    current_sector?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    current_cell?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    current_village?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    profile_picture?: string;

}