export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  roleId: string;
}

export interface ONU {
  id: string;
  customerId: string;
  oltId: string;
  serialNumber: string;
  ponPort: string;
  onuId: number;
}
