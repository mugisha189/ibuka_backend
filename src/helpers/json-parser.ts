import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return value;
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) ? parsedValue : [parsedValue];
      } catch (error) {
        throw new BadRequestException(`Invalid JSON format: ${value}`);
      }
    }
    return value;
  }
}
