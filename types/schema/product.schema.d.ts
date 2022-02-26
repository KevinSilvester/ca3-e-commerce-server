export const bodySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        brand: z.ZodString;
        price: z.ZodNumber;
        inStock: z.ZodBoolean;
        category: z.ZodEnum<["jacket", "t-shirt", "pant", "hoodie"]>;
        stock: z.ZodObject<{
            XS: z.ZodNumber;
            S: z.ZodNumber;
            M: z.ZodNumber;
            L: z.ZodNumber;
            XL: z.ZodNumber;
            XXL: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        }, {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        }>;
        description: z.ZodString;
        gender: z.ZodEnum<["men", "women", "unisex"]>;
    }, "strip", z.ZodTypeAny, {
        description?: string;
        name?: string;
        brand?: string;
        price?: number;
        inStock?: boolean;
        category?: "jacket" | "t-shirt" | "pant" | "hoodie";
        stock?: {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        };
        gender?: "men" | "women" | "unisex";
    }, {
        description?: string;
        name?: string;
        brand?: string;
        price?: number;
        inStock?: boolean;
        category?: "jacket" | "t-shirt" | "pant" | "hoodie";
        stock?: {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        };
        gender?: "men" | "women" | "unisex";
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        description?: string;
        name?: string;
        brand?: string;
        price?: number;
        inStock?: boolean;
        category?: "jacket" | "t-shirt" | "pant" | "hoodie";
        stock?: {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        };
        gender?: "men" | "women" | "unisex";
    };
}, {
    body?: {
        description?: string;
        name?: string;
        brand?: string;
        price?: number;
        inStock?: boolean;
        category?: "jacket" | "t-shirt" | "pant" | "hoodie";
        stock?: {
            XS?: number;
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        };
        gender?: "men" | "women" | "unisex";
    };
}>;
import { z } from "zod";
