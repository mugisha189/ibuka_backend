import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TestimonialsEntity } from './testimonials.entity';
@Injectable()
export class TestimonialsRepository extends Repository<TestimonialsEntity> {
  constructor(private dataSource: DataSource) {
    super(TestimonialsEntity, dataSource.createEntityManager());
  }  
}
