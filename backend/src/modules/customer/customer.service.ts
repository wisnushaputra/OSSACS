import { CustomerRepository, CustomerSearchParams, PaginatedResult } from './customer.repository';
import { NewCustomer, UpdateCustomer } from './customer.schema';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { customers } from '../../db/schema';

export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async getCustomer(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer');
    }
    return customer;
  }

  async getCustomers(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<typeof customers.$inferSelect>> {
    return this.customerRepository.list(params);
  }

  async searchCustomers(params: CustomerSearchParams): Promise<PaginatedResult<typeof customers.$inferSelect>> {
    return this.customerRepository.search(params);
  }

  async getCustomerByCode(customerCode: string) {
    const customer = await this.customerRepository.findByCustomerCode(customerCode);
    if (!customer) {
      throw new NotFoundError('Customer');
    }
    return customer;
  }

  async create(customerData: NewCustomer) {
    const existing = await this.customerRepository.findByCustomerCode(customerData.customerCode);
    if (existing) {
      throw new ConflictError('Customer with this code already exists');
    }
    const customer = await this.customerRepository.create(customerData);
    return customer;
  }

  async update(id: string, customerData: UpdateCustomer) {
    const updatedCustomer = await this.customerRepository.update(id, customerData);
    if (!updatedCustomer) {
      throw new NotFoundError('Customer');
    }
    return updatedCustomer;
  }

  async delete(id: string) {
    const deletedCustomer = await this.customerRepository.delete(id);
    if (!deletedCustomer) {
      throw new NotFoundError('Customer');
    }
    return deletedCustomer;
  }
}
