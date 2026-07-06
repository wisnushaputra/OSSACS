import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { customerApi } from '../services/customer';

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuthStore();

  const {
    data: customer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => {
      if (!id || !accessToken) throw new Error('Customer ID or Access Token missing');
      return customerApi.getCustomerById(id, accessToken);
    },
    enabled: !!id && !!accessToken, // Only run query if id and accessToken are available
  });

  if (isLoading) {
    return <div className="p-6 text-gray-700 dark:text-gray-300">Loading customer details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!customer) {
    return <div className="p-6 text-gray-700 dark:text-gray-300">Customer not found.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Customer Details: {customer.fullName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <p>
            <strong>Customer Code:</strong> {customer.customerCode}
          </p>
          <p>
            <strong>Full Name:</strong> {customer.fullName}
          </p>
          <p>
            <strong>Email:</strong> {customer.email || 'N/A'}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone || 'N/A'}
          </p>
        </div>
        <div>
          <p>
            <strong>Address:</strong> {customer.address || 'N/A'}
          </p>
          <p>
            <strong>Status:</strong> {customer.status}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Updated At:</strong> {new Date(customer.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* Add more details here, e.g., associated ONUs */}
    </div>
  );
};

export default CustomerDetailPage;