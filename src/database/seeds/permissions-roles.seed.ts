import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import * as _ from 'lodash';
import { UserEntity } from 'src/modules/users/model/user.entity';
import { PermissionEntity } from 'src/modules/permissions/model/permission.entity';
import { RoleEntity } from 'src/modules/roles/model/role.entity';
import { ERoleType } from 'src/modules/roles/enums/role.enum';
import { rolePermissions } from '../data/roles';
const users = [
  {
    username: 'hugues',
    email: 'huguesishema@gmail.com',
    password: 'password',
    role: ERoleType.SUPER_ADMIN,
    profile_picture: 'https://res.cloudinary.com/dfiagonwj/image/upload/v1731158593/users/fbgo7mfvmkjy4cxg1g4f.png'
  }
]


export default class CreateUsersSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roleNames = Object.keys(rolePermissions) as ERoleType[];
    const permissions = _.uniqBy(
      roleNames.reduce((acc, roleName) => {
        return acc.concat(rolePermissions[roleName]);
      }, []),
      'slug',
    );
    const permissionSlugs = permissions.map((p) => p.slug);
    const existingPermissions = await connection.manager.find(PermissionEntity, {
      where: { slug: In(permissionSlugs) },
    });
    const validPermissions = permissions.map((p) => {
      const existing = existingPermissions.find((e) => e.slug === p.slug);
      if (existing) {
        return existing;
      }
      return new PermissionEntity(p);
    });
    const savedPermissions = (
      await connection.manager.save(validPermissions)
    ).reduce((acc, p) => {
      return { ...acc, [p.slug]: p };
    }, {});
    const existingRoles = await connection.manager.find(RoleEntity, {
      where: { name: In(roleNames) },
    });
    const existingRoleNames = existingRoles.map(role => role.name);
    const roles = roleNames
      .filter(roleName => !existingRoleNames.includes(roleName))
      .map((name) => {
        const permissions = rolePermissions[name].map((p) => savedPermissions[p.slug]);
        return new RoleEntity({ name, permissions });
      });
    const savedRoles = await connection.manager.save(roles);
    const allRoles = [...existingRoles, ...savedRoles];
    for (const userData of users){
      const user = await connection.manager.findOne(UserEntity, {
        where: { email: userData.email }
      })
      if(user){
        user.roles = Promise.resolve(allRoles);
      }else{
        const user = new UserEntity();
        user.username = userData.username;
        user.email = userData.email;
        user.password = userData.password;
        user.role = userData.role;
        user.profile_picture = userData.profile_picture;
        user.roles = Promise.resolve(allRoles);
        await connection.manager.save(user);
      }
    }
  }
}