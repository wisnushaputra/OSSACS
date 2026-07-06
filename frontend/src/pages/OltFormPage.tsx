import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { oltApi } from '../services/olt';
import EntityForm from '../components/forms/EntityForm';

export default function OltFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const { data: olt, isLoading: isOltLoading } = useQuery({
    queryKey: ['olt', id],
    queryFn: () => oltApi.getOltById(id!, accessToken!),
    enabled: isEdit && !!accessToken,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      isEdit
        ? oltApi.updateOlt(id!, data, accessToken!)
        : oltApi.createOlt(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['olts'] });
      navigate('/olts');
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (data: { ipAddress: string; port: string }) => {
      return oltApi.testConnection(data.ipAddress, data.port, accessToken!);
    },
    onSuccess: (res) => {
      alert(`Connection Test Result: ${res.message}`);
    },
    onError: (error) => {
      alert(`Connection Test Failed: ${error.message}`);
    },
  });

  if (isEdit && isOltLoading) return <div className="p-6">Loading...</div>;

  const fields = [
    { name: 'name', label: 'OLT Name', required: true },
    { name: 'vendor', label: 'Vendor', required: true },
    { name: 'model', label: 'Model' },
    { name: 'ipAddress', label: 'IP Address', required: true },
    { name: 'port', label: 'Port', type: 'number' as const, placeholder: 'e.g., 23 or 22' },
    { name: 'username', label: 'Username', required: true },
    { name: 'password', label: 'Password', type: 'text' as const }, // This should be type 'password'
    { name: 'transport', label: 'Transport', type: 'select' as const, options: [
      { value: 'telnet', label: 'Telnet' },
      { value: 'ssh', label: 'SSH' },
      { value: 'snmp', label: 'SNMP' },
    ], required: true },
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'maintenance', label: 'Maintenance' },
    ], required: true },
    { name: 'popId', label: 'POP ID' }, // Placeholder, needs fetching POPs
    { name: 'location', label: 'Location' },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'enabled', label: 'Enabled', type: 'select' as const, options: [
      { value: 'true', label: 'True' },
      { value: 'false', label: 'False' },
    ], required: true },
  ];

  return (
    <div className="p-6">
      <EntityForm
        title={isEdit ? 'Edit OLT' : 'Add OLT'}
        fields={fields}
        defaultValues={olt || { status: 'active', transport: 'telnet', enabled: 'true', port: 23 }}
        onSubmit={async (data) => {
          // Temporarily handle password and enabled, should be improved
          const submittedData = {
            ...data,
            enabled: data.enabled === 'true',
            port: Number(data.port),
          };
          await mutation.mutateAsync(submittedData);
        }}
        isLoading={mutation.isPending}
        cancelPath="/olts"
      >
        <button
          type="button"
          onClick={() => {
            const currentIpAddress = olt?.ipAddress; // This assumes olt is available for edit
            const currentPort = olt?.port;
            if (currentIpAddress && currentPort) {
              testConnectionMutation.mutate({ ipAddress: currentIpAddress, port: currentPort.toString() });
            } else {
              alert('Please enter IP Address and Port to test connection.');
            }
          }}
          disabled={testConnectionMutation.isPending}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {testConnectionMutation.isPending ? 'Testing...' : 'Test Connection'}
        </button>
      </EntityForm>
    </div>
  );
}
