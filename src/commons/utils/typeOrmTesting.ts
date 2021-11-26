import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "../../modules/usuario/models/user.entity";
import { Prestamo } from "../../modules/prestamo/models/prestamo.entity";

export const typeOrmPrestamo = () => [
  TypeOrmModule.forRoot({
    type: "sqlite",
    database: ":memory:",
    entities: [Prestamo], // Se definen las entidades va administrar (y las cuales creara como tablas al momento de inicar la app)
    synchronize: true
  }),
  TypeOrmModule.forFeature([Prestamo]),
]

export const typeOrmUsuario = () => [
  TypeOrmModule.forRoot({
    type: "sqlite",
    database: ":memory:",
    entities: [Usuario], // Se definen las entidades va administrar (y las cuales creara como tablas al momento de inicar la app)
    synchronize: true
  }),
  TypeOrmModule.forFeature([Usuario]),
]