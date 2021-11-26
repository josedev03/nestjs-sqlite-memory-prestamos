import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Prestamo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isbn: string;

  @Column()
  identificacionUsuario: string;

  @Column()
  tipoUsuario: number;

  @Column()
  fechaMaximaDevolucion: string;
}