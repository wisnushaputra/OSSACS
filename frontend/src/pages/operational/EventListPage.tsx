import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../../services/operational/event';
import { useAuthStore } from '../../store/authStore';
import DataTable from '../../components/ui/DataTable';

const EventListPage = () => {
  const { token } = useAuthStore();
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const [filters, setFilters] = useState({
    eventType: '',
    customerId: '',
    onuId: '',
    oltId: '',
    workflowId: '',
    startDate: '',
    endDate: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', pagination, filters],
    queryFn: () => eventApi.getEvents(token!, { ...pagination, ...filters }),
    enabled: !!token,
  });

  useEffect(() => {
    // Reset pagination when filters change to ensure correct results
    // This effect ensures that a new filter search always starts from the first page
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, [filters]);

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  const columns = [
    { header: 'Timestamp', key: 'createdAt', render: (item: any) => new Date(item.createdAt).toLocaleString() },
    { header: 'Event Type', key: 'eventType' },
    { header: 'Customer ID', key: 'customerId' },
    { header: 'ONU ID', key: 'onuId' },
    { header: 'OLT ID', key: 'oltId' },
    { header: 'Workflow ID', key: 'workflowId' },
    { header: 'Description', key: 'description' },
  ];

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Log</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Event Type"
          value={filters.eventType}
          onChange={(e) => handleFilterChange('eventType', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Customer ID"
          value={filters.customerId}
          onChange={(e) => handleFilterChange('customerId', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="ONU ID"
          value={filters.onuId}
          onChange={(e) => handleFilterChange('onuId', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="OLT ID"
          value={filters.oltId}
          onChange={(e) => handleFilterChange('oltId', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Workflow ID"
          value={filters.workflowId}
          onChange={(e) => handleFilterChange('workflowId', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <DataTable 
        columns={columns} 
        data={data?.data || []}
        total={data?.total || 0}
        currentPage={Math.floor(pagination.offset / pagination.limit) + 1}
        pageSize={pagination.limit}
        onPageChange={(page) => setPagination({ ...pagination, offset: (page - 1) * pagination.limit })}
      />
    </div>
  );
};

export default EventListPage;
