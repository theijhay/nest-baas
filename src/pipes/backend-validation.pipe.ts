import { 
    PipeTransform, 
    Injectable, 
    ArgumentMetadata, 
    BadRequestException, 
    HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utils/format-errors';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) return value;

    throw new BadRequestException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: formatValidationErrors(errors),
    });
  }
}
