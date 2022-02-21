const { z } = require('zod')

const pattern =
   /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`!?"£$€₹%^&*~_\-+=:;'@#,./\\()[\]{}<>]).{10,}$/gm

const createUserSchema = z.object({
   body: z.object({
      name: z.string({ required_error: 'No name provided' }),
      email: z
         .string({ required_error: 'No email provided' })
         .email({ message: 'Not a valid email' }),
      password: z
         .string({ required_error: 'No password provided' })
         .regex(pattern, { message: 'Password does not meet requirements' }),
      accessLevel: z
         .preprocess(
            a => parseInt(a, 10),
            z
               .number()
               .min(parseInt(process.env.ACCESS_LEVEL_GUEST), { message: 'Access level invalid' })
               .max(parseInt(process.env.ACCESS_LEVEL_ADMIN), { message: 'Access level invalid' })
         )
         .optional(),
      profilePhoto: z.string().optional(),
      cart: z.string().array().min(0),
      purchaseHistory: z.string().array().min(0)
   })
})

const loginUserSchema = z.object({
   body: z.object({
      email: z
         .string({ required_error: 'No email provided' })
         .email({ message: 'Not a valid email' }),
      password: z
         .string({ required_error: 'No password provided' })
         .regex(pattern, { message: 'Password does not meet requirements' })
   })
})

module.exports = { createUserSchema, loginUserSchema }
