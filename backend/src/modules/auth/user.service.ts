import { UserRepository } from './user.repository';
import { NotFoundError } from '../../lib/errors';
import * as bcrypt from 'bcrypt';
import { NewUser } from './auth.types';
import { CreateUserInput, UpdateUserInput } from './user.schema';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async listUsers() {
    return this.userRepository.list();
  }

  async createUser(userData: CreateUserInput) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const newUser: NewUser = {
      username: userData.username,
      email: userData.email,
      fullname: userData.fullname,
      roleId: userData.roleId,
      passwordHash,
      isActive: true,
    };

    return this.userRepository.create(newUser);
  }

  async updateUser(id: string, userData: UpdateUserInput) {
    const updateData: Partial<NewUser> = {
      username: userData.username,
      email: userData.email,
      fullname: userData.fullname,
      roleId: userData.roleId,
      isActive: userData.isActive,
    };

    if (userData.password) {
      updateData.passwordHash = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundError('User');
    }
    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser) {
      throw new NotFoundError('User');
    }
    return deletedUser;
  }
}
