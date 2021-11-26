import { Module } from '@nestjs/common';
import { UsuarioController } from './controllers/usuario.controller';
import { Usuario } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario])
  ],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
