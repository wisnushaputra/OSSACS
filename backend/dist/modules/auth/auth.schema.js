import { z } from 'zod';
const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});
const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
        id: z.string().uuid(),
        username: z.string(),
        fullname: z.string(),
        roleId: z.string().uuid(),
    }),
});
const refreshResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});
const userMeResponseSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    fullname: z.string(),
    email: z.string().email(),
    role: z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().optional().nullable(),
    }),
});
const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});
const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});
export const authSchemas = {
    loginSchema,
    refreshSchema,
    loginResponseSchema,
    refreshResponseSchema,
    userMeResponseSchema,
    changePasswordSchema,
    resetPasswordSchema,
};
