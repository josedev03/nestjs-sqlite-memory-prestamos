import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../models/user.entity';

/**
 * Este es un controlador solo de ejemplo, el cual tiene como unico objetivo mostrar como usar el repositorio para interactuar con la base de datos
 * En una arquitectura con una buena separación de capas, no deberíamos inyectar el repositorio en el controlador
 * Este ejemplo no tiene ninguna arquitectura propuesta, usted debería plantear una arquitectura y realizar la separación de capas correcta
 * Acá se hizo solo con el objetivo de que usted vea como usar el objeto repositorio y lo pueda usar en otro objeto
 * 
 */
@Controller("usuario")
export class UsuarioController {
  constructor( @InjectRepository(Usuario)
  private repositorioUsuario: Repository<Usuario>) {}

  @Get()
  async guardarUsuario():  Promise<Usuario[]> {
    await this.repositorioUsuario.save(this.repositorioUsuario.create({nombre:"Nombre Prueba", apellido:"Apellido Prueba"}));
    return this.repositorioUsuario.find();
  }
}
