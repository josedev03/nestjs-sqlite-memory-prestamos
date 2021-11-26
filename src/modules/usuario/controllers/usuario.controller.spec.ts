import { Test, TestingModule } from '@nestjs/testing';
import { typeOrmUsuario } from '../../../commons/utils/typeOrmTesting';
import { UsuarioController } from './usuario.controller';

describe('PrestamoController', () => {
  let usuarioController: UsuarioController;
  // let prestamoService: PrestamoService;
  // let loanRepository: LoanRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmUsuario()],
      controllers: [UsuarioController],
      providers: []
    }).compile();

    usuarioController = module.get<UsuarioController>(UsuarioController);
  });

  it('should be defined', () => {
    expect(usuarioController).toBeDefined();
  });

  it('should return users', async () => {
    const response = [{
      id: 1,
      nombre: "Nombre Prueba",
      apellido: "Apellido Prueba"
    }]

    const result = await usuarioController.guardarUsuario();
    expect(result).toEqual(response);
  })

  // it('should create one loan and return id', async () => {
  //   const body = {
  //     isbn: "8732873287",
	//     identificacionUsuario: "187812782187281",
	//     tipoUsuario: 1
  //   }

  //   const response = {
  //     id: 1,
  //     fechaMaximaDevolucion: "03/12/2021"
  //   }

  //   jest.spyOn(prestamoService, 'crearPrestamo')
  //     .mockImplementation(async () => response);

  //   const result = await prestamoController.crearPrestamo(body);
  //   expect(result).toEqual(response);
  // })
});
