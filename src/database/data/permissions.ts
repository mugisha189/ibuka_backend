import { Permission } from "./permissions-type"
export const permissions: Permission[] = [
    { slug: 'create.users', description: 'Create users' },
    { slug: 'read.users', description: 'Read users' },
    { slug: 'update.users', description: 'Update users' },
    { slug: 'delete.users', description: 'Delete users' },
]