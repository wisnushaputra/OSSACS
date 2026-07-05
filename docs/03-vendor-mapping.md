# 03-vendor-mapping.md

# Broadband Customer Monitoring System (BCMS) - Vendor Mapping Specification

## 1. Supported Hardware Vendors

### OLT Vendors

- Huawei MA5600, MA5800
- ZTE C300, C320
- Fiberhome AN5506
- VSOL
- Nokia ISAM
- Raisecom

### ONU Vendors

- Huawei
- ZTE
- Fiberhome
- VSOL
- TP-Link
- Nokia
- Dasan
- C-DATA
- Intelbras

---

## 2. Status & Alarm Mappings

### Internal ONU Status Enum

```
ONLINE
OFFLINE
LOS
DYING_GASP
DISABLED
UNKNOWN
```

### Vendor Status Mapping Table

| Vendor        | Vendor State | Internal State |
| ------------- | ------------ | -------------- |
| **Huawei**    | online       | ONLINE         |
|               | offline      | OFFLINE        |
|               | los          | LOS            |
|               | dying-gasp   | DYING_GASP     |
| **ZTE**       | working      | ONLINE         |
|               | power-off    | OFFLINE        |
|               | los          | LOS            |
| **Fiberhome** | active       | ONLINE         |
|               | inactive     | OFFLINE        |
| **VSOL**      | up           | ONLINE         |
|               | down         | OFFLINE        |

### Internal Alarm Enum

```
LOS
DYING_GASP
LOFI
LOSI
POWER_FAIL
OPTICAL_LOW
ONU_OFFLINE
ONU_ONLINE
```

---

## 3. Parametric & Command Mappings

### Optical Parameter Mappings

| Parameter    | Huawei           | ZTE      | Fiberhome  | Internal Model     |
| ------------ | ---------------- | -------- | ---------- | ------------------ |
| RX Power     | Rx Optical Power | Rx Power | Optical Rx | `rxPower` (dBm)    |
| TX Power     | Tx Optical Power | Tx Power | Optical Tx | `txPower` (dBm)    |
| Temperature  | -                | -        | -          | `temperature` (°C) |
| Voltage      | -                | -        | -          | `voltage` (V)      |
| Bias Current | -                | -        | -          | `biasCurrent` (mA) |

### TR-069 & TR-181 Parameters

| Parameter     | TR-181 (Modern)                     | TR-098 (Legacy)                                         | Internal Field |
| ------------- | ----------------------------------- | ------------------------------------------------------- | -------------- |
| Serial Number | `Device.DeviceInfo.SerialNumber`    | `InternetGatewayDevice.DeviceInfo.SerialNumber`         | `serialNumber` |
| Manufacturer  | `Device.DeviceInfo.Manufacturer`    | `InternetGatewayDevice.DeviceInfo.Manufacturer`         | `vendor`       |
| Model         | `Device.DeviceInfo.ModelName`       | `InternetGatewayDevice.DeviceInfo.ModelName`            | `model`        |
| Firmware      | `Device.DeviceInfo.SoftwareVersion` | `InternetGatewayDevice.DeviceInfo.SoftwareVersion`      | `firmware`     |
| WiFi SSID     | `Device.WiFi.SSID.*`                | `InternetGatewayDevice.LANDevice.*.WLANConfiguration.*` | `wifi.ssid`    |

### Internal Command to CLI Mapping

| Internal Command      | Huawei CLI Command | ZTE CLI Command     |
| --------------------- | ------------------ | ------------------- |
| `GET_ONU_INFORMATION` | `display ont info` | _(Vendor specific)_ |
| `REGISTER_ONU`        | `ont add`          | _(Vendor specific)_ |
| `DELETE_ONU`          | `ont delete`       | _(Vendor specific)_ |

---

## 4. Error Mapping

| Vendor Error         | Vendor | Internal Error Code  |
| -------------------- | ------ | -------------------- |
| `ONU already exists` | Huawei | `ONU_ALREADY_EXISTS` |
| `Duplicate ONU`      | ZTE    | `ONU_ALREADY_EXISTS` |
