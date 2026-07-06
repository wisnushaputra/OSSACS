import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { profileApi } from '../services/profile';
import DataTable from '../components/ui/DataTable';

export default function ProfileListPage() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => profileApi.getProfiles(accessToken!),
    enabled: !!accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteProfile(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'description', header: 'Description' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profiles</h1>
        <button
          onClick={() => navigate('/profiles/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Profile
        </button>
      </div>
      <DataTable
        data={data?.items || []}
        columns={columns}
        onEdit={(item) => navigate(`/profiles/${item.id}/edit`)}
        onDelete={(item) => {
          if (window.confirm('Are you sure?')) deleteMutation.mutate(item.id);
        }}
      />
    </div>
  );
}
