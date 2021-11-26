import { Module } from '@nestjs/common';
import { PrestamoController } from './controllers/prestamo.controller';
import { Prestamo } from './models/prestamo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamoService } from './service/prestamo.service';
import { LoanRepository } from './repository/prestamo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestamo]),
  ],
  controllers: [PrestamoController],
  providers: [
    PrestamoService,
    LoanRepository
  ]
})
export class PrestamoModule {}
