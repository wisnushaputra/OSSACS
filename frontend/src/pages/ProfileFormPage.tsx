import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { profileApi } from '../services/profile';
import EntityForm from '../components/forms/EntityForm';

export default function ProfileFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profileApi.getProfileById(id!, accessToken!),
    enabled: isEdit && !!accessToken,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      isEdit
        ? profileApi.updateProfile(id!, data, accessToken!)
        : profileApi.createProfile(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      navigate('/profiles');
    },
  });

  if (isEdit && isLoading) return <div className="p-6">Loading...</div>;

  const fields = [
    { name: 'name', label: 'Profile Name', required: true },
    { name: 'type', label: 'Type', type: 'select' as const, options: [
      { value: 'line', label: 'Line' },
      { value: 'service', label: 'Service' },
      { value: 'dba', label: 'DBA' },
      { value: 'vlan', label: 'VLAN' },
    ], required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
  ];

  return (
    <div className="p-6">
      <EntityForm
        title={isEdit ? 'Edit Profile' : 'Add Profile'}
        fields={fields}
        defaultValues={profile || { type: 'line' }}
        onSubmit={async (data) => {
          await mutation.mutateAsync(data);
        }}
        isLoading={mutation.isPending}
        cancelPath="/profiles"
      />
    </div>
  );
}
