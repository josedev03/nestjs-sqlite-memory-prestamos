import { prestamoBodySchema } from '../../modules/prestamo/models/prestamoBody.schema';
import { SchemavalidationPipe } from './schemavalidation.pipe';

describe('SchemavalidationPipe', () => {
  let pipe: SchemavalidationPipe;

  it('create body schema validation instance', () => {
    pipe = new SchemavalidationPipe(prestamoBodySchema);
    expect(pipe).toBeTruthy();
  });

  it('validate body schema', () => {
    const body = {
      isbn: "8732873287",
	    identificacionUsuario: "187812782187281",
	    tipoUsuario: 1
    }
    pipe = new SchemavalidationPipe(prestamoBodySchema);
    const result = pipe.transform(body);
    expect(result).toEqual(body);
  });

  it('validate error body schema', () => {
    const errorResponse = {
      statusCode: 400,
      message: 'isbn is required',
      error: 'Bad Request'
    }
    const body = {
      isbna: "8732873287",
	    identificacionUsuario: "187812782187281",
	    tipoUsuario: 1
    }
    pipe = new SchemavalidationPipe(prestamoBodySchema);
    try {
      pipe.transform(body);
    } catch (error) {
      expect(error.response).toEqual(errorResponse);
    }
  });
});
