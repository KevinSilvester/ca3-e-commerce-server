const { z } = require('zod')

const createProductSchema = z.object({
   body: z.object({
      name: z.string({ required_error: 'No name provided' }),
      brand: z.string({ required_error: 'No brand provided' }),
      price: z.preprocess(
         a => parseInt(a.toString(), 10),
         z
            .number({ required_error: 'No price provided' })
            .min(0.01, { message: 'Price must €0.01 at minimum' })
      ),
      category: z.enum(['jacket', 't-shirt', 'pant', 'hoodie']),
      stock: z.preprocess(
         a => parseInt(a.toString(), 10),
         z
            .number({ required_error: 'Stock number not provided' })
            .min(0, { message: 'Stock number must be 0 at minimum' })
      ),
      description: z.string({ required_error: 'No description provided' }),
      gender: z.enum(['men', 'women', 'unisex'])
   })
})

const editProductSchema = z.object({
   body: z.object({
      name: z.string({ required_error: 'No name provided' }).optional(),
      brand: z.string({ required_error: 'No brand provided' }).optional(),
      price: z.preprocess(
         a => parseInt(a.toString(), 10),
         z
            .number({ required_error: 'No price provided' })
            .min(0.01, { message: 'Price must €0.01 at minimum' })
      ).optional(),
      category: z.enum(['jacket', 't-shirt', 'pant', 'hoodie']).optional(),
      stock: z.preprocess(
         a => parseInt(a.toString(), 10),
         z
            .number({ required_error: 'Stock number not provided' })
            .min(0, { message: 'Stock number must be 0 at minimum' })
      ).optional(),
      description: z.string({ required_error: 'No description provided' }).optional(),
      gender: z.enum(['men', 'women', 'unisex']).optional()
   })
})

module.exports = { createProductSchema, editProductSchema }
