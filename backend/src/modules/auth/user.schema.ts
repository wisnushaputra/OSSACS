import { z } from 'zod';

const userCore = {
  username: z.string().min(3),
  email: z.string().email(),
  fullname: z.string().min(1),
  roleId: z.string().uuid(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  fullname: z.string().min(1).optional(),
  roleId: z.string().uuid().optional(),
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string(),
  fullname: z.string(),
  roleId: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable().optional(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .optional(),
});

const usersResponseSchema = z.array(userResponseSchema);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const userSchemas = {
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
  usersResponseSchema,
};
