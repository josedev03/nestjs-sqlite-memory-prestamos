export interface IPrestamo {
  id?: number,
  isbn: string,
	identificacionUsuario: string,
	tipoUsuario: number,
  fechaMaximaDevolucion?: string
}

export enum TIPO_USUARIO {
  AFILIADO = 1,
  EMPLEADO = 2,
  INVITADO = 3
}

export enum DIAS_DEVOLUCION {
  AFILIADO = 10,
  EMPLEADO = 8,
  INVITADO = 7
}