# 03-olt-adapter-spec.md

# Broadband Customer Monitoring System (BCMS) - OLT Adapter Specification

## 1. Overview & Architecture

OLT Adapter adalah lapisan abstraksi yang bertanggung jawab untuk seluruh komunikasi dengan perangkat OLT.
Business Service **tidak boleh mengetahui** detail implementasi Huawei, ZTE, Fiberhome, VSOL, Nokia, atau vendor lainnya.

Semua komunikasi dilakukan melalui interface yang sama.

```
Business Service
      │
OLT Adapter Interface
      │
   Factory
      │
┌───────────────┬──────────────┬───────────────┐
│ HuaweiAdapter │ ZTEAdapter   │ VSOLAdapter   │
│ Fiberhome     │ NokiaAdapter │ Raisecom      │
└───────────────┴──────────────┴───────────────┘
```

---

## 2. Base OLTAdapter Interface

Setiap vendor adapter wajib mengimplementasikan interface berikut secara utuh.

```ts
interface OLTAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  health(): Promise<boolean>;
  getSystemInfo(): Promise<any>;
  getPonList(): Promise<any[]>;
  getONUList(): Promise<any[]>;
  getONU(onuId: string): Promise<any>;
  registerONU(params: RegisterONUParams): Promise<RegisterONUResult>;
  replaceONU(oldSerial: string, newSerial: string): Promise<boolean>;
  deleteONU(onuId: string): Promise<boolean>;
  authorizeONU(serialNumber: string): Promise<boolean>;
  deauthorizeONU(serialNumber: string): Promise<boolean>;
  rebootONU(onuId: string): Promise<boolean>;
  factoryResetONU(onuId: string): Promise<boolean>;
  configureONU(onuId: string, config: any): Promise<boolean>;
  getOpticalInfo(onuId: string): Promise<OpticalInfo>;
  getSignal(onuId: string): Promise<any>;
  getMAC(onuId: string): Promise<string>;
  getIPAddress(onuId: string): Promise<string>;
  findBySerial(serial: string): Promise<any>;
  findByONUID(onuId: string): Promise<any>;
  findByCustomer(customerCode: string): Promise<any>;
  getLOS(): Promise<any[]>;
  getDyingGasp(): Promise<any[]>;
  getAlarm(): Promise<any[]>;
  clearAlarm(alarmId: string): Promise<boolean>;
  backupConfig(onuId: string): Promise<any>;
  restoreConfig(onuId: string, backupData: any): Promise<boolean>;
}
```

---

## 3. Protocol Priority & Transport selection

Vendor adapter akan memilih protokol transport berdasarkan kemampuan fisik perangkat yang dikonfigurasi:

1. **NETCONF** (Preferred)
2. **REST API**
3. **SSH CLI**
4. **Telnet** (Legacy fallback)
5. **SNMP** (Monitoring traps/polling)

### Transport Mapping Matrix

| Vendor    | Preferred Transport | Fallback Transport |
| --------- | ------------------- | ------------------ |
| Huawei    | NETCONF             | SSH                |
| ZTE       | NETCONF             | SSH                |
| Fiberhome | SSH                 | -                  |
| VSOL      | REST                | SSH                |
| Nokia     | NETCONF             | -                  |
| Raisecom  | SSH                 | -                  |

---

## 4. Key Workflows

### 4.1 Register ONU Flow

1. Masukkan Serial Number.
2. Validasi input & periksa duplikasi.
3. Cari ONU ID yang tersedia di port PON terkait.
4. Buat objek ONU pada OLT.
5. Kaitkan Line Profile, Service Profile, dan VLAN.
6. Commit & Verifikasi perubahan.

### 4.2 Replace ONU Flow

1. Backup konfigurasi ONU lama (VLAN, Profiles, Deskripsi, dll).
2. Hapus registrasi ONU lama pada OLT.
3. Registrasikan ONU baru di port yang sama.
4. Terapkan (Restore) konfigurasi backup ke ONU baru.
5. Lakukan verifikasi dan reboot jika diperlukan.

---

## 5. Standard Error Codes

Adapter harus menangkap error internal vendor dan menerjemahkannya ke standard error code berikut:

- `OLT_CONNECTION_FAILED`
- `ONU_NOT_FOUND`
- `ONU_ALREADY_EXIST`
- `PON_NOT_FOUND`
- `NO_FREE_ONU_ID`
- `PROFILE_NOT_FOUND`
- `VLAN_NOT_FOUND`
- `COMMAND_TIMEOUT`
- `COMMAND_FAILED`
- `AUTH_FAILED`
