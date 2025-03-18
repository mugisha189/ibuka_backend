import { UserEntity } from "./model/user.entity";
import { UserDto } from "./dtos/user.dto";
import { PermissionMapper } from "../permissions/permission.mapper";
import { RoleMapper } from "../roles/role.mapper";

type DtoPopulation = {
    roles?: boolean;
    role?: boolean;
    permissions?: boolean;
  };

export class UsersMapper {
    public static isValidValue(value: any): boolean {
        return value !== undefined && value !== null && value !== 'string;'
    }
    public static async toDtoPermRoles(
        entity: UserEntity,
        population: DtoPopulation = { roles: false, permissions: false }
    ): Promise<UserDto> {
        const { roles, permissions } = population;
        const dto = new UserDto();
        const dtoKeys = new Set(['permissions', 'roles'])
        const entityKeys = new Set([
          'id', 'username',
          'email', 'status', 'profilePhoto',
          'createdAt', 'updatedAt', 'role'
        ])
        for(const key in entity){
            if(!dtoKeys.has(key) && entityKeys.has(key)){
                dto[key] = entity[key];
            }else{
                if(permissions){
                  if(!entity.permissions){
                    entity.permissions = Promise.resolve([]);
                  }
                    const permissions = (await entity.permissions).filter((permission) => permission.active === true);
                    if(permissions.length > 0){
                        dto.permissions = await Promise.all(
                            permissions.map(PermissionMapper.toDto)
                        )
                    }else{
                        dto.permissions = [];
                    }
                }
                if(roles){
                  if(!entity.roles){
                    entity.roles = Promise.resolve([]);
                  }
                    const roles = (await entity.roles).filter((role) => role.active === true);
                    if(roles.length > 0){
                        dto.roles = await Promise.all(
                            roles.map((role) => RoleMapper.toDto(role, { permissions: permissions }))
                        )
                    }else{
                        dto.roles = [];
                    }
                }
            }
        }
        return dto;
    }
}


