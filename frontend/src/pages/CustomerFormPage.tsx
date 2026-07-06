import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { customerApi } from '../services/customer';
import EntityForm from '../components/forms/EntityForm';

export default function CustomerFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getCustomerById(id!, accessToken!),
    enabled: isEdit && !!accessToken,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      isEdit
        ? customerApi.updateCustomer(id!, data, accessToken!)
        : customerApi.createCustomer(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
  });

  if (isEdit && isLoading) return <div className="p-6">Loading...</div>;

  const fields = [
    { name: 'customerCode', label: 'Customer Code', required: true, disabled: isEdit },
    { name: 'fullName', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const },
    { name: 'phone', label: 'Phone' },
    { name: 'address', label: 'Address', type: 'textarea' as const },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
      ],
      required: true,
    },
  ];

  return (
    <div className="p-6">
      <EntityForm
        title={isEdit ? 'Edit Customer' : 'Add Customer'}
        fields={fields}
        defaultValues={customer || { status: 'active' }}
        onSubmit={async (data) => {
          await mutation.mutateAsync(data);
        }}
        isLoading={mutation.isPending}
        cancelPath="/customers"
      />
    </div>
  );
}
