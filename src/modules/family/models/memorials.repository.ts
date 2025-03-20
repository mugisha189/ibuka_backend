import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MemorialsEntity } from './memorials.entity';

@Injectable()
export class MemorialsRepository extends Repository<MemorialsEntity> {
  constructor(private dataSource: DataSource) {
    super(MemorialsEntity, dataSource.createEntityManager());
  }  
}
