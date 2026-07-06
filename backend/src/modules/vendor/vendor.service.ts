import { VendorRepository } from './vendor.repository';
import { NewVendor, UpdateVendorInput } from './vendor.schema';
import { NotFoundError } from '../../lib/errors';

export class VendorService {
  constructor(private vendorRepository: VendorRepository) {}

  async getVendor(id: string) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }
    return vendor;
  }

  async listVendors(limit = 10, offset = 0) {
    return this.vendorRepository.list(limit, offset);
  }

  async createVendor(vendorData: NewVendor) {
    const vendor = await this.vendorRepository.create(vendorData);
    return vendor;
  }

  async updateVendor(id: string, data: UpdateVendorInput) {
    const updatedVendor = await this.vendorRepository.update(id, data);
    if (!updatedVendor) {
      throw new NotFoundError('Vendor');
    }
    return updatedVendor;
  }

  async deleteVendor(id: string) {
    const deletedVendor = await this.vendorRepository.delete(id);
    if (!deletedVendor) {
      throw new NotFoundError('Vendor');
    }
    return deletedVendor;
  }
}