// src/packages/socket-contracts/index.ts
export interface DashboardUpdateEvent {
  totalCustomers: number;
  onlineCustomers: number;
  offlineCustomers: number;
  losCount: number;
  dyingGaspCount: number;
}

export interface DeviceStatusUpdateEvent {
  serialNumber: string;
  status: 'ONLINE' | 'OFFLINE' | 'LOS' | 'DYING_GASP' | 'UNKNOWN';
  rxPower?: number;
}

export interface NotificationEvent {
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
