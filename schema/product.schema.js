const { z } = require('zod')

const stockSchema = z.object({
   XS: z
      .number({ required_error: 'Stock number for XS not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' }),
   S: z
      .number({ required_error: 'Stock number for S not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' }),
   M: z
      .number({ required_error: 'Stock number for M not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' }),
   L: z
      .number({ required_error: 'Stock number for L not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' }),
   XL: z
      .number({ required_error: 'Stock number for XL not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' }),
   XXL: z
      .number({ required_error: 'Stock number for XXL not provided' })
      .min(0, { message: 'Stock number must be 0 at minimum' })
})

const bodySchema = z.object({
   body: z.object({
      name: z.string({ required_error: 'No name provided' }),
      brand: z.string({ required_error: 'No brand provided' }),
      price: z
         .number({ required_error: 'No price provided' })
         .min(0.01, { message: 'Price must €0.01 at minimum' }),
      inStock: z.boolean({ required_error: 'No in stock value provided' }),
      category: z.enum(['jacket', 't-shirt', 'pant', 'hoodie']),
      stock: stockSchema,
      description: z.string({ required_error: 'No description provided' }),
      gender: z.enum(['men', 'women', 'unisex'])
   })
})

module.exports = { bodySchema }
