import { CommonEntity } from "src/common/entities";
import { 
    Entity, 
    JoinTable, ManyToMany, 
    OneToMany,
    Column,
    BeforeInsert
} from 'typeorm';
import { HashHelper } from "src/helpers";
import { RoleEntity } from "src/modules/roles/model/role.entity";
import { PermissionEntity } from "src/modules/permissions/model/permission.entity";
import { TokenEntity } from "src/modules/tokens/model/token.entity";
import { UserStatus } from "../enums/user-status.enum";
import { ERoleType } from "src/modules/roles/enums/role.enum";

@Entity({ name: "users", schema: "users" })
export class UserEntity extends CommonEntity {

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, type: 'enum', enum: ERoleType, default: ERoleType.NONE })
    role: ERoleType;

    @Column({ nullable: false, type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ nullable: true })
    profile_picture: string;

    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        schema: 'users',
        name: 'users-roles',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'roleId',
            referencedColumnName: 'id',
        }
    })
    roles: Promise<RoleEntity[]>;

    @ManyToMany(() => PermissionEntity, (permission) => permission.users, { cascade: true })
    @JoinTable({
        schema: 'users',
        name: 'users-permissions',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id',
        },

    })
    permissions: Promise<PermissionEntity[]>;

    @OneToMany(() => TokenEntity, (token) => token.user)
    tokens: TokenEntity[];

    @BeforeInsert()
    async hashPassword(){
        this.password = await HashHelper.encrypt(this.password);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await HashHelper.compare(password, this.password);
    }
}