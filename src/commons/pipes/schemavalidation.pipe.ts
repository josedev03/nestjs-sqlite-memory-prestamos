import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

export class SchemavalidationPipe implements PipeTransform {

  constructor(private schema: ObjectSchema){}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if(!!error?.message){
      const errorMessage = error.message.replace(/["]/g, '',) || 'Validación fallida';
      throw new BadRequestException(errorMessage);
    }
    return value;
  }
}
