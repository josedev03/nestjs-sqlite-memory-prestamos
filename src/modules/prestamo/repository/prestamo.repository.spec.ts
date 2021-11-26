import { Test, TestingModule } from "@nestjs/testing";
import { typeOrmPrestamo } from "../../../commons/utils/typeOrmTesting";
import { PrestamoService } from '../service/prestamo.service';
import { LoanRepository } from './prestamo.repository';

describe('PrestamoRespository', ()=>{
  let service: PrestamoService;
  let loanRepository: LoanRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmPrestamo()],
      providers: [PrestamoService, LoanRepository]
    }).compile()
    service = module.get<PrestamoService>(PrestamoService);
    loanRepository = module.get<LoanRepository>(LoanRepository);
  })

  it('should be called', async ()=>{
    const response = await service.crearPrestamo({isbn: '8732873287', identificacionUsuario: '187812782187281', tipoUsuario: 1});
    expect(response).toHaveProperty('id');
  })

  it('should create one loan', async () => {
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "187812782187281",
      tipoUsuario: 1
    }

    const response = {
      id: 1,
      isbn: '8732873287',
      identificacionUsuario: '187812782187281',
      tipoUsuario: 1,
      fechaMaximaDevolucion: new Date()
    };

    jest.spyOn(loanRepository, 'crearPrestamo')
      .mockImplementation(async () => response)

    const result = await loanRepository.crearPrestamo(body);
    expect(result).toEqual(response);
  })

  it('should return one loan', async () => {
    const id = 1;

    const result = await loanRepository.obtenerPrestamoPorId(id);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('isbn');
    expect(result).toHaveProperty('identificacionUsuario');
  })

  it('should return null with not exists loan', async () => {
    const id = 99999;

    const result = await loanRepository.obtenerPrestamoPorId(id);
    expect(result).toBeNull();
  })

  it('should return all loans from one user', async () => {
    const body = {
      isbn: "8732873287",
      identificacionUsuario: "187812782187281",
      tipoUsuario: 1,
      fechaMaximaDevolucion: new Date()
    }
    await loanRepository.crearPrestamo(body);
    const result = await loanRepository.obtenerPrestamosUsuario('187812782187281');
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('isbn');
    expect(result[0]).toHaveProperty('identificacionUsuario');
    expect(result[0]).toHaveProperty('fechaMaximaDevolucion');
  })
})