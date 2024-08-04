import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.safeParse(value);
      if (!parsedValue.success) {
        throw new BadRequestException(parsedValue.error.issues[0].message);
      }
      return parsedValue.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
