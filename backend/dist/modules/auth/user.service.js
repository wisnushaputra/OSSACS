import { NotFoundError } from '../../lib/errors';
import * as bcrypt from 'bcrypt';
export class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError('User');
        }
        return user;
    }
    async listUsers() {
        return this.userRepository.list();
    }
    async createUser(userData) {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const newUser = {
            username: userData.username,
            email: userData.email,
            fullname: userData.fullname,
            roleId: userData.roleId,
            passwordHash,
            isActive: true,
        };
        return this.userRepository.create(newUser);
    }
    async updateUser(id, userData) {
        const updateData = {
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
    async deleteUser(id) {
        const deletedUser = await this.userRepository.delete(id);
        if (!deletedUser) {
            throw new NotFoundError('User');
        }
        return deletedUser;
    }
}
