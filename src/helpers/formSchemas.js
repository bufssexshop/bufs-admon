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
  precio: Joi.number().required(),
  precioCredito: Joi.number(),
  detalles: Joi.string().required(),
  promocion: Joi.boolean().required(),
  valorPromocion: Joi.number().required(),
  categoria: Joi.string().required(),
  subcategoria: Joi.string().required(),
  categoriaDos: Joi.string(),
  subcategoriaDos: Joi.string(),
  disponible: Joi.boolean().required(),
  image: Joi.object({
    file: Joi.object().required(),
    original: Joi.string().required(),
    thumbnail: Joi.string().required(),
  }).required(),
  image2: Joi.object({
    file: Joi.object().required(),
    original: Joi.string().required(),
    thumbnail: Joi.string().required(),
  }),
})