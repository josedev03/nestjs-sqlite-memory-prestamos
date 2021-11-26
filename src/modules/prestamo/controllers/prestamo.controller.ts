import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchemavalidationPipe } from '../../../commons/pipes/schemavalidation.pipe';
import { IPrestamo } from '../interfaces/prestamo.interface';
import { prestamoBodySchema } from '../models/prestamoBody.schema';
import { PrestamoService } from '../service/prestamo.service';

@Controller('prestamo')
export class PrestamoController {
  
  constructor( private prestamoService: PrestamoService) {}

  @Post()
  async crearPrestamo(@Body(new SchemavalidationPipe(prestamoBodySchema)) payload: IPrestamo){
    return await this.prestamoService.crearPrestamo(payload);
  }


  @Get('/:id')
  async obtenerPrestamo(@Param() params: any){
    return await this.prestamoService.obtenerPrestamo(params.id);
  }
}
