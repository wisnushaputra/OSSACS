import { db } from '../../db';
import { roles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NewRole } from './auth.types';

export class RoleRepository {
  async findById(id: string) {
    return db.query.roles.findFirst({
      where: eq(roles.id, id),
    });
  }

  async findByName(name: string) {
    return db.query.roles.findFirst({
      where: eq(roles.name, name),
    });
  }

  async create(roleData: NewRole) {
    const [newRole] = await db.insert(roles).values(roleData).returning();
    return newRole;
  }

  async update(id: string, roleData: Partial<NewRole>) {
    const [updatedRole] = await db.update(roles).set(roleData).where(eq(roles.id, id)).returning();
    return updatedRole;
  }

  async delete(id: string) {
    const [deletedRole] = await db.delete(roles).where(eq(roles.id, id)).returning();
    return deletedRole;
  }

  async list() {
    return db.query.roles.findMany();
  }
}
