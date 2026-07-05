import { NotFoundError } from '../../lib/errors';
export class RoleService {
    roleRepository;
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async getRoleById(id) {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new NotFoundError('Role');
        }
        return role;
    }
    async getRoleByName(name) {
        const role = await this.roleRepository.findByName(name);
        if (!role) {
            throw new NotFoundError('Role');
        }
        return role;
    }
    async createRole(roleData) {
        return this.roleRepository.create(roleData);
    }
    async updateRole(id, roleData) {
        const role = await this.roleRepository.update(id, roleData);
        if (!role) {
            throw new NotFoundError('Role');
        }
        return role;
    }
    async deleteRole(id) {
        const role = await this.roleRepository.delete(id);
        if (!role) {
            throw new NotFoundError('Role');
        }
        return role;
    }
    async listRoles() {
        return this.roleRepository.list();
    }
}
