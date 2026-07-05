import { RoleRepository } from './role.repository';
import { NewRole } from './auth.types';
import { NotFoundError } from '../../lib/errors';

export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getRoleById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role');
    }
    return role;
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundError('Role');
    }
    return role;
  }

  async createRole(roleData: NewRole) {
    return this.roleRepository.create(roleData);
  }

  async updateRole(id: string, roleData: Partial<NewRole>) {
    const role = await this.roleRepository.update(id, roleData);
    if (!role) {
      throw new NotFoundError('Role');
    }
    return role;
  }

  async deleteRole(id: string) {
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
