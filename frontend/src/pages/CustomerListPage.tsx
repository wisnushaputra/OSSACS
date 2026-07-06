import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { customerApi } from '../services/customer';
import DataTable from '../components/ui/DataTable';

export default function CustomerListPage() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApi.getCustomers(accessToken!),
    enabled: !!accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  const columns = [
    { key: 'customerCode', header: 'Code' },
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <button
          onClick={() => navigate('/customers/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Customer
        </button>
      </div>
      <DataTable
        data={data?.items || []}
        columns={columns}
        onView={(item) => navigate(`/customers/${item.id}`)}
        onEdit={(item) => navigate(`/customers/${item.id}/edit`)}
        onDelete={(item) => {
          if (window.confirm('Are you sure?')) deleteMutation.mutate(item.id);
        }}
      />
    </div>
  );
}
