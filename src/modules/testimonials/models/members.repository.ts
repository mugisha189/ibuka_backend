import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MembersEntity } from './members.entity';

@Injectable()
export class MembersRepository extends Repository<MembersEntity> {
  constructor(private dataSource: DataSource) {
    super(MembersEntity, dataSource.createEntityManager());
  }  
}
