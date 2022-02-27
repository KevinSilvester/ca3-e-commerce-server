const { z } = require('zod')

z.preprocess(
   a => parseInt(a.toString(), 10),
   z
      .number({ required_error: 'Stock number for XS not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' })
)

const stockSchema = z.object({
   XS: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for XS not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   ),
   S: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for S not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   ),
   M: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for M not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   ),
   L: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for L not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   ),
   XL: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for XL not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   ),
   XXL: z.preprocess(
      a => parseInt(a.toString(), 10),
      z
         .number({ required_error: 'Stock number for XXL not provided' })
         .min(0, { message: 'Stock number must be 0 at minimum' })
   )
})

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
      stock: stockSchema,
      description: z.string({ required_error: 'No description provided' }),
      gender: z.enum(['men', 'women', 'unisex'])
   })
})

module.exports = { createProductSchema }
