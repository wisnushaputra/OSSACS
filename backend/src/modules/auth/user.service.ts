import { UserRepository } from './user.repository';
import { NewUser } from './auth.types';
import { NotFoundError } from '../../lib/errors';
import * as bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async listUsers() {
    return this.userRepository.list();
  }

  async createUser(userData: NewUser) {
    // Hash password before saving
    const passwordHash = await bcrypt.hash(userData.passwordHash, 10);
    return this.userRepository.create({
      ...userData,
      passwordHash,
    });
  }

  async updateUser(id: string, userData: Partial<NewUser>) {
    // Hash password if provided
    let updateData = userData;
    if (userData.passwordHash) {
      const passwordHash = await bcrypt.hash(userData.passwordHash, 10);
      updateData = { ...userData, passwordHash };
    }
    return this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}