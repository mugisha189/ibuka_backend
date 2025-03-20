import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HelpingEntity } from './helping.entity';

@Injectable()
export class HelpingRepository extends Repository<HelpingEntity> {
  constructor(private dataSource: DataSource) {
    super(HelpingEntity, dataSource.createEntityManager());
  }  
}
