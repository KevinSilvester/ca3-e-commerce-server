export const createUserSchema: z.ZodObject<
   {
      body: z.ZodObject<
         {
            name: z.ZodString
            email: z.ZodString
            password: z.ZodString
            accessLevel: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>
            profilePhoto: z.ZodOptional<z.ZodString>
            cart: z.ZodArray<z.ZodString, 'many'>
            purchaseHistory: z.ZodArray<z.ZodString, 'many'>
         },
         'strip',
         z.ZodTypeAny,
         {
            password?: string
            name?: string
            email?: string
            accessLevel?: number
            profilePhoto?: string
            cart?: string[]
            purchaseHistory?: string[]
         },
         {
            password?: string
            name?: string
            email?: string
            accessLevel?: number
            profilePhoto?: string
            cart?: string[]
            purchaseHistory?: string[]
         }
      >
   },
   'strip',
   z.ZodTypeAny,
   {
      body?: {
         password?: string
         name?: string
         email?: string
         accessLevel?: number
         profilePhoto?: string
         cart?: string[]
         purchaseHistory?: string[]
      }
   },
   {
      body?: {
         password?: string
         name?: string
         email?: string
         accessLevel?: number
         profilePhoto?: string
         cart?: string[]
         purchaseHistory?: string[]
      }
   }
>
export const loginUserSchema: z.ZodObject<
   {
      body: z.ZodObject<
         {
            email: z.ZodString
            password: z.ZodString
         },
         'strip',
         z.ZodTypeAny,
         {
            password?: string
            email?: string
         },
         {
            password?: string
            email?: string
         }
      >
   },
   'strip',
   z.ZodTypeAny,
   {
      body?: {
         password?: string
         email?: string
      }
   },
   {
      body?: {
         password?: string
         email?: string
      }
   }
>
export const editUserSchema: z.ZodObject<
   {
      body: z.ZodObject<
         {
            name: z.ZodOptional<z.ZodString>
            email: z.ZodOptional<z.ZodString>
            password: z.ZodOptional<z.ZodString>
            cart: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>
         },
         'strip',
         z.ZodTypeAny,
         {
            password?: string
            name?: string
            email?: string
            cart?: string[]
         },
         {
            password?: string
            name?: string
            email?: string
            cart?: string[]
         }
      >
   },
   'strip',
   z.ZodTypeAny,
   {
      body?: {
         password?: string
         name?: string
         email?: string
         cart?: string[]
      }
   },
   {
      body?: {
         password?: string
         name?: string
         email?: string
         cart?: string[]
      }
   }
>
import { z } from 'zod'
