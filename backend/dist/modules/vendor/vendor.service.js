import { NotFoundError } from '../../lib/errors';
export class VendorService {
    vendorRepository;
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async getVendor(id) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            throw new NotFoundError('Vendor');
        }
        return vendor;
    }
    async listVendors(limit = 10, offset = 0) {
        return this.vendorRepository.list(limit, offset);
    }
    async createVendor(vendorData) {
        const vendor = await this.vendorRepository.create(vendorData);
        return vendor;
    }
    async updateVendor(id, data) {
        const updatedVendor = await this.vendorRepository.update(id, data);
        if (!updatedVendor) {
            throw new NotFoundError('Vendor');
        }
        return updatedVendor;
    }
    async deleteVendor(id) {
        const deletedVendor = await this.vendorRepository.delete(id);
        if (!deletedVendor) {
            throw new NotFoundError('Vendor');
        }
        return deletedVendor;
    }
}
