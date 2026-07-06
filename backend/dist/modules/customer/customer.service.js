import { NotFoundError, ConflictError } from '../../lib/errors';
export class CustomerService {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async getCustomer(id) {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw new NotFoundError('Customer');
        }
        return customer;
    }
    async getCustomers(params) {
        return this.customerRepository.list(params);
    }
    async searchCustomers(params) {
        return this.customerRepository.search(params);
    }
    async getCustomerByCode(customerCode) {
        const customer = await this.customerRepository.findByCustomerCode(customerCode);
        if (!customer) {
            throw new NotFoundError('Customer');
        }
        return customer;
    }
    async create(customerData) {
        const existing = await this.customerRepository.findByCustomerCode(customerData.customerCode);
        if (existing) {
            throw new ConflictError('Customer with this code already exists');
        }
        const customer = await this.customerRepository.create(customerData);
        return customer;
    }
    async update(id, customerData) {
        const updatedCustomer = await this.customerRepository.update(id, customerData);
        if (!updatedCustomer) {
            throw new NotFoundError('Customer');
        }
        return updatedCustomer;
    }
    async delete(id) {
        const deletedCustomer = await this.customerRepository.delete(id);
        if (!deletedCustomer) {
            throw new NotFoundError('Customer');
        }
        return deletedCustomer;
    }
}
