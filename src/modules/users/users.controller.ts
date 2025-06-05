import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateDistrictUserDto, CreateProvinceUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { TOKEN_NAME } from 'src/constants';
import { ResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1'
})
@ApiBearerAuth(TOKEN_NAME)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Get all users paginated with search' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ description: 'Paginated users', type: ResponseDto })
  @Get()
  async getAllUsers(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    return this.usersService.getAllUsersPaginated(search ?? '', currentPage, currentLimit);
  }

  @ApiOperation({ summary: 'Create a user for a district (admin only)' })
  @ApiOkResponse({ description: 'User created and email sent', type: ResponseDto })
  @Post("/district")
  async createUserForDistrict(
    @Body() dto: CreateDistrictUserDto,
  ) {
    return this.usersService.createUserForDistrict(dto);
  }


  @ApiOperation({ summary: 'Create a user for a province (admin only)' })
  @ApiOkResponse({ description: 'User created and email sent', type: ResponseDto })
  @Post("/province")
  async createUserForProvince(
    @Body() dto: CreateProvinceUserDto,
  ) {
    return this.usersService.createUserForProvince(dto);
  }


  @ApiOperation({ summary: 'Activate or deactivate a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'User status updated', type: ResponseDto })
  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto
  ) {
    return this.usersService.updateUserStatus(id, dto);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'User retrieved', type: ResponseDto })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update profile by logged-in user' })
  @ApiOkResponse({ description: 'Profile updated', type: ResponseDto })
  @Patch('profile')
  async updateProfile(
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(dto);
  }
}