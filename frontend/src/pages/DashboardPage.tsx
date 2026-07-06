import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard';
import { useAuthStore } from '../store/auth';

const Card = ({ title, value, color }: { title: string, value: number | string, color: string }) => (
  <div className={`p-4 rounded shadow bg-white dark:bg-gray-800 border-l-4 ${color}`}>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
  </div>
);

const ProgressBar = ({ label, value, max, colorClass }: { label: string, value: number, max: number, colorClass: string }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span>{label}</span>
      <span>{value} ({max > 0 ? Math.round((value / max) * 100) : 0}%)</span>
    </div>
    <div className="w-full bg-gray-200 rounded h-2 dark:bg-gray-700">
      <div className={`h-2 rounded ${colorClass}`} style={{ width: \`\${max > 0 ? (value / max) * 100 : 0}%\` }}></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { accessToken } = useAuthStore();
  
  const { data: summary } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 30000,
  });

  const { data: opticalDist } = useQuery({
    queryKey: ['dashboard', 'optical-dist'],
    queryFn: () => dashboardApi.getOpticalDistribution(accessToken!),
    enabled: !!accessToken,
  });

  const { data: vendorData } = useQuery({
    queryKey: ['dashboard', 'vendor'],
    queryFn: () => dashboardApi.getOnuByVendor(accessToken!),
    enabled: !!accessToken,
  });

  const { data: latestAlarms } = useQuery({
    queryKey: ['dashboard', 'latest-alarms'],
    queryFn: () => dashboardApi.getLatestAlarms(accessToken!),
    enabled: !!accessToken,
  });

  if (!summary) return <div className="p-4">Loading dashboard...</div>;

  const totalOptical = opticalDist ? (opticalDist.normal + opticalDist.warning + opticalDist.critical) : 0;
  const totalVendorOnus = vendorData ? vendorData.reduce((acc: number, curr: any) => acc + curr.count, 0) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Customers" value={summary.totalCustomers} color="border-blue-500" />
        <Card title="Total ONUs" value={summary.totalOnus} color="border-indigo-500" />
        <Card title="Online ONUs" value={summary.onlineOnus} color="border-green-500" />
        <Card title="Offline ONUs" value={summary.offlineOnus} color="border-gray-500" />
        <Card title="LOS Alarms" value={summary.losOnus} color="border-red-500" />
        <Card title="Dying Gasp" value={summary.dyingGaspOnus} color="border-orange-500" />
        <Card title="Active Alarms" value={summary.activeAlarms} color="border-red-600" />
        <Card title="Running Workflows" value={summary.runningWorkflows} color="border-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Optical Distribution (CSS Chart) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Optical Power Distribution</h3>
          {opticalDist ? (
            <div className="space-y-4">
              <ProgressBar label="Normal (-10 to -24 dBm)" value={opticalDist.normal} max={totalOptical} colorClass="bg-green-500" />
              <ProgressBar label="Warning (-24 to -28 dBm)" value={opticalDist.warning} max={totalOptical} colorClass="bg-yellow-500" />
              <ProgressBar label="Critical (< -28 dBm)" value={opticalDist.critical} max={totalOptical} colorClass="bg-red-500" />
            </div>
          ) : <p className="text-sm text-gray-500">Loading...</p>}
        </div>

        {/* Vendor Distribution (CSS Chart) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Vendor Distribution</h3>
          {vendorData ? (
            <div className="space-y-4">
              {vendorData.map((v: any, idx: number) => (
                <ProgressBar key={idx} label={v.vendor || 'Unknown'} value={v.count} max={totalVendorOnus} colorClass="bg-blue-500" />
              ))}
              {vendorData.length === 0 && <p className="text-sm text-gray-500">No vendor data</p>}
            </div>
          ) : <p className="text-sm text-gray-500">Loading...</p>}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Quick Actions</h3>
          <div className="flex flex-col space-y-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm text-left">Register ONU</button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm text-left">Replace ONU</button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm text-left">Push PPPoE</button>
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm text-left">Push WiFi</button>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm text-left">Reboot ONU</button>
          </div>
        </div>

      </div>

      {/* Latest Alarms Panel */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Latest Alarms</h3>
        {latestAlarms && latestAlarms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Severity</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {latestAlarms.map((alarm: any) => (
                  <tr key={alarm.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{new Date(alarm.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={\`px-2 py-1 text-xs rounded \${alarm.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}\`}>
                        {alarm.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2">{alarm.customer || 'Unknown'}</td>
                    <td className="px-4 py-2">{alarm.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active alarms.</p>
        )}
      </div>

    </div>
  );
}
// ponytail: CSS/DOM-based progress bars instead of heavy Chart.js/Recharts. Add charting library only if complex interactive graphing is required.
