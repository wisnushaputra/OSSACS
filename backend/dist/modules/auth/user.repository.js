import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
export class UserRepository {
    async findById(id) {
        return db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                role: true,
            },
        });
    }
    async findByUsername(username) {
        return db.query.users.findFirst({
            where: eq(users.username, username),
            with: {
                role: true,
            },
        });
    }
    async findByEmail(email) {
        return db.query.users.findFirst({
            where: eq(users.email, email),
            with: {
                role: true,
            },
        });
    }
    async create(userData) {
        const [newUser] = await db.insert(users).values(userData).returning();
        return this.findById(newUser.id);
    }
    async update(id, userData) {
        const [updatedUser] = await db
            .update(users)
            .set({ ...userData, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return updatedUser ? this.findById(updatedUser.id) : undefined;
    }
    async delete(id) {
        const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
        return deletedUser ? this.findById(deletedUser.id) : undefined;
    }
    async list() {
        return db.query.users.findMany({
            with: {
                role: true,
            },
        });
    }
}
