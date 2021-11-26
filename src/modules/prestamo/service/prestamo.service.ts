import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon-business-days';
import { IPrestamo, TIPO_USUARIO, DIAS_DEVOLUCION } from '../interfaces/prestamo.interface';
import { LoanRepository } from '../repository/prestamo.repository';

@Injectable()
export class PrestamoService {
  
  private fechaMaximaDevolucion: string;
  private prestamosPermitidos = 1;

  constructor(
    private loanRepository: LoanRepository
  ){}

  async crearPrestamo(payload: IPrestamo){
    
    try {
      this.validarTipoUsuario(payload);
      await this.validarSolicitudPrestamo(payload);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    this.fechaMaximaDevolucion = this.obtenerFechaMaximaDevolucion(payload);
    payload = {...payload, fechaMaximaDevolucion: this.fechaMaximaDevolucion};

    const nuevoPrestamo = await this.loanRepository.crearPrestamo(payload);

    return {
      id: nuevoPrestamo.id,
      fechaMaximaDevolucion : nuevoPrestamo.fechaMaximaDevolucion
    }
  }

  async obtenerPrestamo(idPrestamo: number){
    const prestamo = await this.loanRepository.obtenerPrestamoPorId(idPrestamo);
    return prestamo || {}
  }

  private obtenerFechaMaximaDevolucion(payload: IPrestamo): string{
    const diasDiferencia = this.obtenerDiasDiferencia(payload);
    // return DateTime.local({zone: 'America/bogota'}).plusBusiness({days: diasDiferencia}).toJSDate();
    return this.addDaysSkippingWeekends(new Date(), diasDiferencia);
  }

  private obtenerDiasDiferencia(payload: IPrestamo): number{
    return payload.tipoUsuario == TIPO_USUARIO.AFILIADO 
      ? DIAS_DEVOLUCION.AFILIADO
      :  payload.tipoUsuario == TIPO_USUARIO.EMPLEADO
      ? DIAS_DEVOLUCION.EMPLEADO
      : DIAS_DEVOLUCION.INVITADO
  }

  private addDaysSkippingWeekends(dateFrom: Date, numberDaysToAdd: number) {
    var endDate = new Date();
    var count = 0;
    while (count < numberDaysToAdd) {
      endDate = new Date(dateFrom.setDate(dateFrom.getDate() + 1));
      if (endDate.getDay() != 0 && endDate.getDay() != 6) {
        count++;
      }
    }
    return endDate.toLocaleDateString("es-CO");
  }

  private async validarSolicitudPrestamo(payload: IPrestamo){
    if(payload.tipoUsuario === TIPO_USUARIO.INVITADO) {
      const prestamos = await this.loanRepository.obtenerPrestamosUsuario(payload.identificacionUsuario);
      if(prestamos.length >= this.prestamosPermitidos){
        throw {
          mensaje : `El usuario con identificación ${payload.identificacionUsuario} ya tiene un libro prestado por lo cual no se le puede realizar otro préstamo`
        }
      }
    }
  }

  private validarTipoUsuario(payload: IPrestamo){
    if(!(payload.tipoUsuario in TIPO_USUARIO)){
      throw {
        mensaje : "Tipo de usuario no permitido en la biblioteca"
      }
    }
  }
}
