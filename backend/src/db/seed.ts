import { db } from './index';
import { roles, permissions, rolePermissions, vendors, profiles } from './schema';
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
  // config
  { name: 'wifi:update', description: 'Update WiFi configuration' },
  { name: 'pppoe:update', description: 'Update PPPoE configuration' },
  // vendor
  { name: 'vendor:read', description: 'Read vendors' },
  { name: 'vendor:create', description: 'Create vendors' },
  { name: 'vendor:update', description: 'Update vendors' },
  { name: 'vendor:delete', description: 'Delete vendors' },
  // profile
  { name: 'profile:read', description: 'Read profiles' },
  { name: 'profile:create', description: 'Create profiles' },
  { name: 'profile:update', description: 'Update profiles' },
  { name: 'profile:delete', description: 'Delete profiles' },
  // region
  { name: 'region:read', description: 'Read regions' },
  { name: 'region:create', description: 'Create regions' },
  { name: 'region:update', description: 'Update regions' },
  { name: 'region:delete', description: 'Delete regions' },
  // pop
  { name: 'pop:read', description: 'Read pops' },
  { name: 'pop:create', description: 'Create pops' },
  { name: 'pop:update', description: 'Update pops' },
  { name: 'pop:delete', description: 'Delete pops' },
  // system
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
    const insertedPermissions: Record<string, string> = {};
    for (const perm of defaultPermissions) {
      const existing = await db.query.permissions.findFirst({
        where: eq(permissions.name, perm.name),
      });

      if (!existing) {
        const [inserted] = await db.insert(permissions).values(perm).returning();
        insertedPermissions[inserted.name] = inserted.id;
        logger.info(`Inserted permission: ${perm.name}`);
      } else {
        insertedPermissions[existing.name] = existing.id;
      }
    }

    // 2. Seed Roles
    const insertedRoles: Record<string, string> = {};
    for (const role of defaultRoles) {
      const existing = await db.query.roles.findFirst({
        where: eq(roles.name, role.name),
      });

      if (!existing) {
        const [inserted] = await db.insert(roles).values(role).returning();
        insertedRoles[inserted.name] = inserted.id;
        logger.info(`Inserted role: ${role.name}`);
      } else {
        insertedRoles[existing.name] = existing.id;
      }
    }

    // 3. Map Permissions to Roles
    const rolePermissionMap: Record<string, string[]> = {
      Admin: Object.keys(insertedPermissions),
      NOC: ['dashboard:view', 'customer:read', 'onu:read', 'onu:reboot', 'vendor:read', 'profile:read', 'region:read', 'pop:read'],
      Technician: [
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
      if (!roleId) continue;

      for (const permName of perms) {
        const permissionId = insertedPermissions[permName];
        if (!permissionId) continue;

        const existingMapping = await db.query.rolePermissions.findFirst({
          where: (rp, { and, eq }) => and(eq(rp.roleId, roleId), eq(rp.permissionId, permissionId)),
        });

        if (!existingMapping) {
          await db.insert(rolePermissions).values({ roleId, permissionId });
        }
      }
      logger.info(`Mapped permissions for role: ${roleName}`);
    }

    // 4. Seed Default Vendors
    const defaultVendors = [
      { name: 'Huawei', description: 'Huawei Technologies' },
      { name: 'ZTE', description: 'ZTE Corporation' },
      { name: 'Fiberhome', description: 'Fiberhome Telecommunication Technologies' },
      { name: 'VSOL', description: 'Guangzhou V-Solution Telecommunication Technology' },
      { name: 'Nokia', description: 'Nokia Corporation' },
      { name: 'Raisecom', description: 'Raisecom Technology' },
    ];

    for (const vendor of defaultVendors) {
      const existingVendor = await db.query.vendors.findFirst({
        where: eq(vendors.name, vendor.name),
      });

      if (!existingVendor) {
        await db.insert(vendors).values(vendor);
        logger.info(`Inserted vendor: ${vendor.name}`);
      }
    }

    // 5. Seed Default Profiles
    const defaultProfiles = [
      { name: 'Line Profile - Basic', type: 'line' as const, description: 'Basic line profile' },
      { name: 'Service Profile - Internet', type: 'service' as const, description: 'Internet service profile' },
      { name: 'DBA Profile - Standard', type: 'dba' as const, description: 'Standard DBA profile' },
      { name: 'VLAN Profile - Default', type: 'vlan' as const, description: 'Default VLAN profile' },
    ];

    for (const profile of defaultProfiles) {
      const existingProfile = await db.query.profiles.findFirst({
        where: (p, { and, eq }) => and(eq(p.name, profile.name), eq(p.type, profile.type)),
      });

      if (!existingProfile) {
        await db.insert(profiles).values(profile);
        logger.info(`Inserted profile: ${profile.name} (${profile.type})`);
      }
    }

    logger.info('Database seeding completed successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Error during database seeding');
  } finally {
    process.exit(0);
  }
}

seed();
