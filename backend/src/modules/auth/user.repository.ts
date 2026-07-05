import { db } from '../../db';
import { users, roles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NewUser, User } from './auth.types';

export class UserRepository {
  async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        role: true,
      },
    });
  }

  async findByUsername(username: string) {
    return db.query.users.findFirst({
      where: eq(users.username, username),
      with: {
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        role: true,
      },
    });
  }

  async create(userData: NewUser) {
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  }

  async update(id: string, userData: Partial<NewUser>) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }

  async list() {
    return db.query.users.findMany({
      with: {
        role: true,
      },
    });
  }
}