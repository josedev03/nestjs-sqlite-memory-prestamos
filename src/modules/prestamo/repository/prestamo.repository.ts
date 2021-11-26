import { Injectable } from "@nestjs/common";
import { Prestamo } from "../models/prestamo.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPrestamo } from "../interfaces/prestamo.interface";

@Injectable()
export class LoanRepository {
  constructor( 
    @InjectRepository(Prestamo)
    private readonly repositorioPrestamo: Repository<Prestamo>
  ) {}

  async crearPrestamo(prestamo: IPrestamo){
    return await this.repositorioPrestamo.save(
      this.repositorioPrestamo.create({
          isbn: prestamo.isbn,
          identificacionUsuario: prestamo.identificacionUsuario,
          tipoUsuario: prestamo.tipoUsuario,
          fechaMaximaDevolucion: prestamo.fechaMaximaDevolucion
      })
    );
  }

  async obtenerPrestamosUsuario(identificacionUsuario: string){
    return await this.repositorioPrestamo.find({where: {identificacionUsuario} });
  }

  async obtenerPrestamoPorId(idPrestamo: number){
    const prestamos = await this.repositorioPrestamo.find({where: {id: idPrestamo} });
    return prestamos[0] || null;
  }
}