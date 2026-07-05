import { db } from './index';
import { roles, permissions, rolePermissions } from './schema';
import { eq } from 'drizzle-orm';
import { logger } from '../lib/logger';
const defaultPermissions = [
    // Dashboard
    { name: 'dashboard:view', description: 'View dashboard' },
    // User
    { name: 'user:read', description: 'Read users' },
    { name: 'user:create', description: 'Create users' },
    { name: 'user:update', description: 'Update users' },
    { name: 'user:delete', description: 'Delete users' },
    // Customer
    { name: 'customer:read', description: 'Read customers' },
    { name: 'customer:create', description: 'Create customers' },
    { name: 'customer:update', description: 'Update customers' },
    { name: 'customer:delete', description: 'Delete customers' },
    // ONU
    { name: 'onu:read', description: 'Read ONUs' },
    { name: 'onu:register', description: 'Register new ONU' },
    { name: 'onu:replace', description: 'Replace existing ONU' },
    { name: 'onu:delete', description: 'Delete ONU' },
    { name: 'onu:reboot', description: 'Reboot ONU' },
    { name: 'onu:factory-reset', description: 'Factory reset ONU' },
    // Config
    { name: 'wifi:update', description: 'Update WiFi configuration' },
    { name: 'pppoe:update', description: 'Update PPPoE configuration' },
    // System
    { name: 'workflow:execute', description: 'Execute workflows' },
    { name: 'olt:manage', description: 'Manage OLT devices' },
    { name: 'genieacs:manage', description: 'Manage GenieACS settings' },
];
const defaultRoles = [
    { name: 'Admin', description: 'System Administrator with full access' },
    { name: 'NOC', description: 'Network Operations Center' },
    { name: 'Technician', description: 'Field Technician' },
];
async function seed() {
    logger.info('Starting database seeding...');
    try {
        // 1. Seed Permissions
        const insertedPermissions = {};
        for (const perm of defaultPermissions) {
            const existing = await db.query.permissions.findFirst({
                where: eq(permissions.name, perm.name),
            });
            if (!existing) {
                const [inserted] = await db.insert(permissions).values(perm).returning();
                insertedPermissions[inserted.name] = inserted.id;
                logger.info(`Inserted permission: ${perm.name}`);
            }
            else {
                insertedPermissions[existing.name] = existing.id;
            }
        }
        // 2. Seed Roles
        const insertedRoles = {};
        for (const role of defaultRoles) {
            const existing = await db.query.roles.findFirst({
                where: eq(roles.name, role.name),
            });
            if (!existing) {
                const [inserted] = await db.insert(roles).values(role).returning();
                insertedRoles[inserted.name] = inserted.id;
                logger.info(`Inserted role: ${role.name}`);
            }
            else {
                insertedRoles[existing.name] = existing.id;
            }
        }
        // 3. Map Permissions to Roles
        const rolePermissionMap = {
            'Admin': Object.keys(insertedPermissions), // Admin gets all permissions
            'NOC': [
                'dashboard:view',
                'customer:read',
                'onu:read',
                'onu:reboot',
            ],
            'Technician': [
                'dashboard:view',
                'customer:read',
                'onu:read',
                'onu:register',
                'onu:replace',
                'wifi:update',
                'pppoe:update',
            ],
        };
        for (const [roleName, perms] of Object.entries(rolePermissionMap)) {
            const roleId = insertedRoles[roleName];
            if (!roleId)
                continue;
            for (const permName of perms) {
                const permissionId = insertedPermissions[permName];
                if (!permissionId)
                    continue;
                // Check if mapping exists
                const existingMapping = await db.query.rolePermissions.findFirst({
                    where: (rp, { and, eq }) => and(eq(rp.roleId, roleId), eq(rp.permissionId, permissionId)),
                });
                if (!existingMapping) {
                    await db.insert(rolePermissions).values({ roleId, permissionId });
                }
            }
            logger.info(`Mapped permissions for role: ${roleName}`);
        }
        logger.info('Database seeding completed successfully.');
    }
    catch (error) {
        logger.error({ err: error }, 'Error during database seeding');
    }
    finally {
        process.exit(0);
    }
}
seed();
