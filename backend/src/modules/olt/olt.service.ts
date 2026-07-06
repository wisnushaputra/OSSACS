import { OltRepository } from './olt.repository';
import { NewOlt, UpdateOlt } from './olt.schema';
import { NotFoundError, ConflictError } from '../../lib/errors';
import * as bcrypt from 'bcrypt';
import net from 'net';
import { db } from '../../db';
import { ponPorts } from '../../db/schema';

export class OltService {
  constructor(private oltRepository: OltRepository) {}

  async testConnection(ipAddress: string, port: string): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000); // 2 second timeout

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(parseInt(port, 10), ipAddress);
    });
  }

  async getOlt(id: string) {
    const olt = await this.oltRepository.findById(id);
    if (!olt) {
      throw new NotFoundError('OLT');
    }
    return olt;
  }

  async getOltByName(name: string) {
    const olt = await this.oltRepository.findByName(name);
    if (!olt) {
      throw new NotFoundError('OLT');
    }
    return olt;
  }

  async listOLTs(params?: { limit?: number; offset?: number }) {
    return this.oltRepository.list(params);
  }

  async createOlt(oltData: NewOlt) {
    const existingName = await this.oltRepository.findByName(oltData.name);
    if (existingName) {
      throw new ConflictError('OLT with this name already exists');
    }

    // Encrypt password before saving
    const encryptedPassword = await bcrypt.hash(oltData.password, 10);
    const olt = await this.oltRepository.create({ ...oltData, passwordHash: encryptedPassword });
    if (!olt) throw new Error('Failed to create OLT');

    // Generate default PON ports based on portCount
    const portCount = oltData.portCount ?? 16;
    const ponPortValues = Array.from({ length: portCount }, (_, index) => ({
      oltId: olt.id,
      name: `PON ${index + 1}`,
      portNumber: index + 1,
      maxOnu: 128,
      description: `Auto-generated PON port ${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.insert(ponPorts).values(ponPortValues);

    // Omit passwordHash from the returned object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...oltWithoutPassword } = olt;
    return oltWithoutPassword;
  }

  async updateOlt(id: string, oltData: UpdateOlt) {
    const updateData: Partial<NewOlt & { passwordHash?: string }> = { ...oltData };
    // Hash password if it's provided
    if (oltData.password) {
      updateData.passwordHash = await bcrypt.hash(oltData.password, 10);
      // Remove original password from update data to avoid conflicts
      delete updateData.password;
    }

    const updatedOlt = await this.oltRepository.update(id, updateData);
    if (!updatedOlt) {
      throw new NotFoundError('OLT');
    }
    // Omit passwordHash from the returned object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...oltWithoutPassword } = updatedOlt;
    return oltWithoutPassword;
  }

  async deleteOlt(id: string) {
    const deletedOlt = await this.oltRepository.delete(id);
    if (!deletedOlt) {
      throw new NotFoundError('OLT');
    }
    // Omit passwordHash from the returned object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...oltWithoutPassword } = deletedOlt;
    return oltWithoutPassword;
  }
}