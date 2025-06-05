import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FamilyEntity } from './family.entity';

@Injectable()
export class FamilyRepository extends Repository<FamilyEntity> {
  constructor(private dataSource: DataSource) {
    super(FamilyEntity, dataSource.createEntityManager());
  }  
}
