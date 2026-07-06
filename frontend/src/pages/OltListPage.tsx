import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { oltApi } from '../services/olt';
import DataTable from '../components/ui/DataTable';

export default function OltListPage() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['olts'],
    queryFn: () => oltApi.getOlts(accessToken!),
    enabled: !!accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => oltApi.deleteOlt(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['olts'] });
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'vendor', header: 'Vendor' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OLTs</h1>
        <button
          onClick={() => navigate('/olts/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add OLT
        </button>
      </div>
      <DataTable
        data={data?.items || []}
        columns={columns}
        onView={(item) => navigate(`/olts/${item.id}`)}
        onEdit={(item) => navigate(`/olts/${item.id}/edit`)}
        onDelete={(item) => {
          if (window.confirm('Are you sure?')) deleteMutation.mutate(item.id);
        }}
      />
    </div>
  );
}
