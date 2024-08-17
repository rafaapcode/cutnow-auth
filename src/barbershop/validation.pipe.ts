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
      console.log(value[0]);
      const parsedValue = this.schema.safeParse(value);
      if (!parsedValue.success) {
        console.log(parsedValue.error);
        throw new BadRequestException(parsedValue.error.issues[0].message);
      }
      return parsedValue.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
