import { Module } from '@nestjs/common';
import { PrestamoModule } from './modules/prestamo/prestamo.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './modules/usuario/models/user.entity';
import { Prestamo } from './modules/prestamo/models/prestamo.entity';

/**
 * NestJs es un framework modular, acá se puso todo el manejo del objeto Usuario desde el App modulo, que es el que da inicio a todo el proyecto
 * En su solución planteada, debería tratar de separar nuevos modulos con sus responsabilidades definidas
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: "sqlite",
        database: ":memory:",
        entities: [Prestamo, Usuario], // Se definen las entidades va administrar (y las cuales creara como tablas al momento de inicar la app)
        synchronize: true
      }),
    PrestamoModule, UsuarioModule //Administración de entidades debería hacerce solo en cada modulo encargado de la entidad
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
