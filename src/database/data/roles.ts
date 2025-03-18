import { permissions } from "./permissions";
import { Permission } from "./permissions-type";
import { ERoleType } from "src/modules/roles/enums/role.enum";
export const rolePermissions: Record<ERoleType, Permission[]> = {
    [ERoleType.SUPER_ADMIN]: permissions,
    [ERoleType.DISTRICT_ADMIN]: [],
    [ERoleType.NONE] : []
};
