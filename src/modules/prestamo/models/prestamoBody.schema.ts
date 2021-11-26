const Joi = require('joi');

export const prestamoBodySchema = Joi.object({
  isbn: Joi
    .string()
    .required()
    .messages({"error": "El identificador del libro es requerido"}),
  identificacionUsuario: Joi
    .string()
    .required()
    .messages({"error": "La identificación del usuario es requerida"}),
  tipoUsuario: Joi
    .number()
    .required()
    .messages({"error": "El tipo de cliente es requerido"})
})