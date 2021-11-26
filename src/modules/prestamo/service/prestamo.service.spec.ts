import { Test, TestingModule } from '@nestjs/testing';
import { LoanRepository } from '../repository/prestamo.repository';
import { PrestamoService } from './prestamo.service';
import { typeOrmPrestamo } from '../../../commons/utils/typeOrmTesting';

describe('PrestamoService', () => {
  let prestamoService: PrestamoService;
  let prestamoRepository: LoanRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmPrestamo()],
      providers: [
        PrestamoService,
        LoanRepository
      ],
    }).compile();

    prestamoService = module.get<PrestamoService>(PrestamoService);
    prestamoRepository = module.get<LoanRepository>(LoanRepository);
  });

  it('should be defined', () => {
    expect(prestamoService).toBeDefined();
  });

  it('should return error user type', async () => {
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "187812782187281",
      tipoUsuario: 4
    }

    const errorResponse = {
      mensaje: 'Tipo de usuario no permitido en la biblioteca'
    }

    try {
      await prestamoService.crearPrestamo(body);
    } catch (error) {
      expect(error.response).toEqual(errorResponse)
    }
  });

  it('should create loan by empleado user', async () => {
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "1878127821872812",
      tipoUsuario: 2
    }

    const result = await prestamoService.crearPrestamo(body);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  // it('should create loan by invitado user', async () => {
  //   const body = {
  //     isbn: "8732873287",
  //     identificacionUsuario: "1878127821872812",
  //     tipoUsuario: 3
  //   }

  //   const result = await prestamoService.crearPrestamo(body);
  //   expect(result).toBeDefined();
  //   expect(result).toHaveProperty('id');
  // });

  it('should return error to invitado user', async () => {
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "1878127821872812",
      tipoUsuario: 3
    }

    const errorResponse = {
      mensaje: `El usuario con identificación ${body.identificacionUsuario} ya tiene un libro prestado por lo cual no se le puede realizar otro préstamo`
    }

    try {
      await prestamoService.crearPrestamo(body);
      await prestamoService.crearPrestamo(body);
    } catch (error) {
      expect(error.response).toEqual(errorResponse) 
    }
  });

  it('should return loans from user by identification', async () => {
    const idPrestamo = 1;
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "1878127821872812",
      tipoUsuario: 1
    }

    await prestamoService.crearPrestamo(body);
    const result: any = await prestamoService.obtenerPrestamo(idPrestamo);
    expect(result).toHaveProperty('id');
    expect(result.id).toEqual(1);
  });

  it('should return empty object because loan with id not exists', async () => {
    const idPrestamo = 9999999;
    const result = await prestamoService.obtenerPrestamo(idPrestamo);
    expect(result).toMatchObject({});
  });
});
