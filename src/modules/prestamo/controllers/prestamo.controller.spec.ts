import { Test, TestingModule } from '@nestjs/testing';
import { PrestamoService } from '../service/prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { typeOrmPrestamo } from '../../../commons/utils/typeOrmTesting';
import { LoanRepository } from '../repository/prestamo.repository';

describe('PrestamoController', () => {
  let prestamoController: PrestamoController;
  let prestamoService: PrestamoService;
  let loanRepository: LoanRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmPrestamo()],
      controllers: [PrestamoController],
      providers: [PrestamoService, LoanRepository]
    }).compile();

    prestamoController = module.get<PrestamoController>(PrestamoController);
    prestamoService = module.get<PrestamoService>(PrestamoService);
    loanRepository = module.get<LoanRepository>(LoanRepository);
  });

  it('should be defined', () => {
    expect(prestamoController).toBeDefined();
  });

  it('should return one loan', async () => {
    const id = 1;

    const response = {
      id: 1,
      isbn: "8732873287",
      identificacionUsuario: "187812782187281",
      tipoUsuario: 1,
      fechaMaximaDevolucion: "03/12/2021"
    }

    jest.spyOn(prestamoService, 'obtenerPrestamo')
      .mockImplementation(async () => response);

    const result = await prestamoController.obtenerPrestamo(id);
    expect(result).toEqual(response);
  })

  it('should create one loan and return id', async () => {
    const body = {
      isbn: "8732873287",
	    identificacionUsuario: "187812782187281",
	    tipoUsuario: 1
    }

    const response = {
      id: 1,
      fechaMaximaDevolucion: "03/12/2021"
    }

    jest.spyOn(prestamoService, 'crearPrestamo')
      .mockImplementation(async () => response);

    const result = await prestamoController.crearPrestamo(body);
    expect(result).toEqual(response);
  })
});
