import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required()
})

export const productSchema = Joi.object({
  codigo: Joi.string().required(),
  nombre: Joi.string().required(),
  precio: Joi.string().required(),
  precioCredito: Joi.string().required(),
  detalles: Joi.string().required(),
  promocion: Joi.boolean().required(),
  valorPromocion: Joi.string().required(),
  categoria: Joi.string().required(),
  subcategoria: Joi.string().required(),
  categoriaDos: Joi.string(),
  subcategoriaDos: Joi.string(),
  disponible: Joi.boolean().required(),
})

export const editProductSchema = Joi.object({
  codigo: Joi.string().required(),
  nombre: Joi.string().required(),
  precio: Joi.string().required(),
  precioCredito: Joi.string().required(),
  detalles: Joi.string().required(),
  categoria: Joi.string().required(),
  subcategoria: Joi.string().required(),
  categoriaDos: Joi.string(),
  subcategoriaDos: Joi.string(),
  disponible: Joi.boolean().required(),
})