import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findUserByUsernameOrEmail(identifier: string): Promise<UserEntity> {
    return this.createQueryBuilder('u')
      .where('u.email = :identifier OR u.username = :identifier', { identifier })
      .getOne();
  }

  async findPaginatedUsers(search: string, page: number, limit: number) {
    const query = this.createQueryBuilder('user');
    if (search) {
      query.andWhere('user.username ILIKE :search OR user.email ILIKE :search', { search: `%${search}%` });
    }
    query.orderBy('user.createdAt', 'DESC');
    query.skip((page - 1) * limit).take(limit);
    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }
}
