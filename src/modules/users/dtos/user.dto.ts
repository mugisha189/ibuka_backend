import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from 'src/modules/roles/dtos/role-dto';
import { PermissionDto } from 'src/modules/permissions/dtos/permission-dto';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ERoleType } from 'src/modules/roles/enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserDto extends BaseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profilePhoto: string[];

  @ApiProperty({ type: [RoleDto] })
  roles?: RoleDto[];

  @ApiProperty({ type: [PermissionDto] })
  permissions?: PermissionDto[];

  @ApiProperty()
  role: ERoleType;

  @ApiProperty()
  status: UserStatus;

}