import { Test } from "@nestjs/testing";
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import SolicitudPrestarLibroTest from "./solicitud-prestar-libro-test";
import { AppModule } from "../src/app.module";
import { ResultadoPrestarLibroTest } from "./resultado-prestar-libro-test";
import { PrestamoTest } from "./prestamo-test";
chai.use(chaiHttp);

describe('Prestamos biblioteca test', () => {

  const USUARIO_AFILIADO = 1;
  const USUARIO_EMPLEADO = 2;
  const USUARIO_INVITADO = 3;
  const USUARIO_DESCONOCIDO = 5;

  let app;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('prestamo Libro Usuario Afiliado Deberia Almacenar Correctamente Y Calcular Fecha De Devolucion', async () => {
    const resultadoPrestarLibro: ResultadoPrestarLibroTest = (await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "ASDA7884",
        "974148",
        USUARIO_AFILIADO
      ))).body;


    const resultadoPrestamo: PrestamoTest = (await chai.request(app.getHttpServer()).get(`/prestamo/${resultadoPrestarLibro.id}`)).body

    chai.expect(resultadoPrestamo).to.have.property('id');
    chai.expect(resultadoPrestamo.fechaMaximaDevolucion).to.equal(addDaysSkippingWeekends(new Date(), 10));
    chai.expect(resultadoPrestamo.isbn).to.equal('ASDA7884');
    chai.expect(resultadoPrestamo.identificacionUsuario).to.equal('974148');
    chai.expect(resultadoPrestamo.tipoUsuario).to.equal(USUARIO_AFILIADO);

  });


  it('prestamo Libro Usuario Empleado Deberia Almacenar Correctamente Y Calcular Fecha De Devolucion', async () => {
    const resultadoPrestarLibro: ResultadoPrestarLibroTest = (await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "AWQ489",
        "7481545",
        USUARIO_EMPLEADO
      ))).body;


    const resultadoPrestamo: PrestamoTest = (await chai.request(app.getHttpServer()).get(`/prestamo/${resultadoPrestarLibro.id}`)).body

    chai.expect(resultadoPrestamo).to.have.property('id');
    chai.expect(resultadoPrestamo.fechaMaximaDevolucion).to.equal(addDaysSkippingWeekends(new Date(), 8));
    chai.expect(resultadoPrestamo.isbn).to.equal('AWQ489');
    chai.expect(resultadoPrestamo.identificacionUsuario).to.equal('7481545');
    chai.expect(resultadoPrestamo.tipoUsuario).to.equal(USUARIO_EMPLEADO);
  });


  it('prestamo Libro Usuario Invitado Deberia Almacenar Correctamente Y Calcular Fecha De Devolucion', async () => {
    const resultadoPrestarLibro: ResultadoPrestarLibroTest = (await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "74851254",
        USUARIO_INVITADO
      ))).body;


    const resultadoPrestamo: PrestamoTest = (await chai.request(app.getHttpServer()).get(`/prestamo/${resultadoPrestarLibro.id}`)).body

    chai.expect(resultadoPrestamo).to.have.property('id');
    chai.expect(resultadoPrestamo.fechaMaximaDevolucion).to.equal(addDaysSkippingWeekends(new Date(), 7));
    chai.expect(resultadoPrestamo.isbn).to.equal('EQWQW8545');
    chai.expect(resultadoPrestamo.identificacionUsuario).to.equal('74851254');
    chai.expect(resultadoPrestamo.tipoUsuario).to.equal(USUARIO_INVITADO);
  });

  it('usuario Invitado Tratando De Prestar Un Segundo Libro Deberia Retornar Excepcion', async () => {

    const resultadoPrestarPrimerLibro = await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "1111111111",
        USUARIO_INVITADO
      ));

    chai.expect(resultadoPrestarPrimerLibro.status).to.equal(201);

    const resultadoPrestarSegundoLibro = await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "1111111111",
        USUARIO_INVITADO
      ));
    chai.expect(resultadoPrestarSegundoLibro.status).to.equal(400);
    chai.expect(resultadoPrestarSegundoLibro.body.mensaje).to.equal('El usuario con identificación 1111111111 ya tiene un libro prestado por lo cual no se le puede realizar otro préstamo');
  });

  it('usuario Diferente A Invitado Tratando De Prestar Un Segundo Libro Deberia Prestarlo Correctamente', async () => {

    const resultadoPrestarPrimerLibro = await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "1111111111",
        USUARIO_AFILIADO
      ));

    chai.expect(resultadoPrestarPrimerLibro.status).to.equal(201);
    chai.expect(resultadoPrestarPrimerLibro.body).to.have.property('id');
    chai.expect(resultadoPrestarPrimerLibro.body).to.have.property('fechaMaximaDevolucion');

    const resultadoPrestarSegundoLibro = await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "1111111111",
        USUARIO_AFILIADO
      ));
    chai.expect(resultadoPrestarSegundoLibro.status).to.equal(201);
    chai.expect(resultadoPrestarSegundoLibro.body).to.have.property('id');
    chai.expect(resultadoPrestarSegundoLibro.body).to.have.property('fechaMaximaDevolucion');

  });

  it('prestamo Con Tipo De Usuario No Permitido Deberia Retornar Excepcion', async () => {

    const resultadoPrestarLibro = await chai.request(app.getHttpServer())
      .post('/prestamo')
      .send(new SolicitudPrestarLibroTest(
        "EQWQW8545",
        "1111111111",
        USUARIO_DESCONOCIDO
      ));

    chai.expect(resultadoPrestarLibro.status).to.equal(400);
    chai.expect(resultadoPrestarLibro.body.mensaje).to.equal('Tipo de usuario no permitido en la biblioteca');
  });
  
  function addDaysSkippingWeekends(dateFrom: Date, numberDaysToAdd: number) {
    var endDate = new Date();
    var count = 0;
    while (count < numberDaysToAdd) {
      endDate = new Date(dateFrom.setDate(dateFrom.getDate() + 1));
      if (endDate.getDay() != 0 && endDate.getDay() != 6) {
        count++;
      }
    }
    return endDate.toLocaleDateString("es-CO");
  }

});
