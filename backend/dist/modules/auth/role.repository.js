import { db } from '../../db';
import { roles } from '../../db/schema';
import { eq } from 'drizzle-orm';
export class RoleRepository {
    async findById(id) {
        return db.query.roles.findFirst({
            where: eq(roles.id, id),
        });
    }
    async findByName(name) {
        return db.query.roles.findFirst({
            where: eq(roles.name, name),
        });
    }
    async create(roleData) {
        const [newRole] = await db.insert(roles).values(roleData).returning();
        return newRole;
    }
    async update(id, roleData) {
        const [updatedRole] = await db.update(roles).set(roleData).where(eq(roles.id, id)).returning();
        return updatedRole;
    }
    async delete(id) {
        const [deletedRole] = await db.delete(roles).where(eq(roles.id, id)).returning();
        return deletedRole;
    }
    async list() {
        return db.query.roles.findMany();
    }
}
