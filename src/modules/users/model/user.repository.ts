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

  
}
