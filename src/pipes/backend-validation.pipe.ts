import { 
  PipeTransform, 
  Injectable, 
  ArgumentMetadata, 
  BadRequestException, 
  HttpStatus 
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utils/format-errors';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Skip validation if no metatype or if metatype is a primitive type
    if (!metadata.metatype || this.isPrimitive(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) return value;

    throw new BadRequestException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: formatValidationErrors(errors),
    });
  }

  private isPrimitive(metatype: any): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}