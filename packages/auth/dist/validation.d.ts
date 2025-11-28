import { z } from "zod";
export declare const signupSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}, {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}>, {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}, {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
//# sourceMappingURL=validation.d.ts.map