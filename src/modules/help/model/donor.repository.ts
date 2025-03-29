import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DonorEntity } from './donor.entity';

@Injectable()
export class DonorRepository extends Repository<DonorEntity> {
  constructor(private dataSource: DataSource) {
    super(DonorEntity, dataSource.createEntityManager());
  }  
}
