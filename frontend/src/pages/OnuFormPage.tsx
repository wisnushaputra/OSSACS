import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { onuApi } from '../services/onu';
import { customerApi } from '../services/customer'; // For customer dropdown
import { oltApi } from '../services/olt'; // For OLT dropdown
import { profileApi } from '../services/profile'; // For profile dropdown
import EntityForm from '../components/forms/EntityForm';

export default function OnuFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const { data: onu, isLoading: isOnuLoading } = useQuery({
    queryKey: ['onu', id],
    queryFn: () => onuApi.getOnuById(id!, accessToken!),
    enabled: isEdit && !!accessToken,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ['customers-all'],
    queryFn: () => customerApi.getCustomers(accessToken!, { limit: 1000 }), // Fetch all or a large number
    enabled: !!accessToken,
  });

  const { data: olts, isLoading: isOltsLoading } = useQuery({
    queryKey: ['olts-all'],
    queryFn: () => oltApi.getOlts(accessToken!, { limit: 1000 }), // Fetch all or a large number
    enabled: !!accessToken,
  });

  const { data: profiles, isLoading: isProfilesLoading } = useQuery({
    queryKey: ['profiles-all'],
    queryFn: () => profileApi.getProfiles(accessToken!, { limit: 1000 }), // Fetch all or a large number
    enabled: !!accessToken,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      isEdit
        ? onuApi.updateOnu(id!, data, accessToken!)
        : onuApi.createOnu(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onus'] });
      navigate('/onus');
    },
  });

  if (isEdit && isOnuLoading || isCustomersLoading || isOltsLoading || isProfilesLoading) return <div className="p-6">Loading...</div>;

  const customerOptions = customers?.items?.map((c: any) => ({ value: c.id, label: c.fullName })) || [];
  const oltOptions = olts?.items?.map((o: any) => ({ value: o.id, label: o.name })) || [];
  const profileOptions = profiles?.items?.map((p: any) => ({ value: p.name, label: p.name })) || []; // Assuming profile name is unique and used as identifier

  const fields = [
    { name: 'customerId', label: 'Customer', type: 'select' as const, options: customerOptions, required: true },
    { name: 'oltId', label: 'OLT', type: 'select' as const, options: oltOptions, required: true },
    { name: 'serialNumber', label: 'Serial Number', required: true },
    { name: 'genieDeviceId', label: 'Genie Device ID', required: true },
    { name: 'ponPort', label: 'PON Port', required: true },
    { name: 'onuId', label: 'ONU ID', type: 'number' as const, required: true },
    { name: 'profileName', label: 'Profile', type: 'select' as const, options: profileOptions, required: true },
    { name: 'vlan', label: 'VLAN', type: 'number' as const, required: true },
    { name: 'firmware', label: 'Firmware' },
    { name: 'model', label: 'Model' },
    { name: 'manufacturer', label: 'Manufacturer' },
  ];

  return (
    <div className="p-6">
      <EntityForm
        title={isEdit ? 'Edit ONU' : 'Add ONU'}
        fields={fields}
        defaultValues={onu}
        onSubmit={async (data) => {
          const submittedData = {
            ...data,
            onuId: Number(data.onuId),
            vlan: Number(data.vlan),
          };
          await mutation.mutateAsync(submittedData);
        }}
        isLoading={mutation.isPending}
        cancelPath="/onus"
      />
    </div>
  );
}
