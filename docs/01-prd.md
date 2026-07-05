# 01-prd.md

# Broadband Customer Monitoring System (BCMS) - Product Requirements Document (PRD)

## Version

v1.0

---

## 1. Project Overview

### Project Name

Broadband Customer Monitoring System (BCMS)

### Goal

Membangun dashboard monitoring customer broadband berbasis web yang terintegrasi dengan GenieACS sehingga NOC maupun teknisi dapat melakukan monitoring status ONU secara realtime tanpa harus membuka GenieACS secara langsung.

Aplikasi harus memiliki tampilan modern, ringan, responsive, realtime, dan mudah dikembangkan.

---

## 2. User Roles & Permissions

### Administrator (Full Access)

- User Management
- Device Management
- OLT Management
- ONU Registration
- PPPoE Push
- Replace ONU
- Monitoring
- Logs
- Dashboard

### NOC

- Monitoring
- Search Customer
- View Logs
- Push PPPoE
- Reboot ONU
- _Cannot: Delete Data, Manage Users_

### Technician

- Register ONU
- Replace ONU
- Configure SSID
- Configure PPPoE
- _Cannot: User Management, System Configuration_

---

## 3. Main Features

### 3.1 Dashboard Realtime

Dashboard harus menyajikan status secara realtime menggunakan Socket.IO.

- **Widgets**: Total Customer, Online Customer, Offline Customer, LOS, Dying Gasp, Power Off, Unknown, Total OLT, Total ONU.
- **Charts**: Online Trend, LOS Trend, Dying Gasp Trend.
- **OLT Status Cards**: Ringkasan status (Online, LOS, Dying Gasp, Offline) per OLT.

### 3.2 Monitoring ONU

- **ONU Table**: Menyajikan list ONU dengan parameter (Serial Number, Customer Name, OLT, PON, ONU ID, PPPoE Username, IP Address, RX Power, TX Power, Uptime, Status, Last Inform, Last Contact, SSID, Firmware).
- **Filters**: OLT, Status, Customer, SN, PPPoE.

### 3.3 Customer Search

- **Search By**: Name, SN, PPPoE, ONU ID, OLT, VLAN.
- **Details Displayed**: Customer Detail, ONU Information, Realtime Status, History, Signal, Configuration.

### 3.4 Alarm & Event Monitoring

- **LOS Monitoring**: Realtime event list (ONU, Customer, Time, Duration, OLT, Port) dengan penanda warna kritis.
- **Dying Gasp Monitoring**: Realtime alert dengan notifikasi suara dan toast (ONU, Customer, Time, OLT, Duration).

### 3.5 OLT Monitoring

- List OLT (Name, Vendor, Total ONU, Online, Offline, LOS, CPU, Memory).
- Support untuk vendor Huawei, ZTE, Fiberhome, VSOL, Nokia, Raisecom.

### 3.6 ONU Provisioning & Workflows

- **ONU Registration**: Memasukkan Serial Number, mengambil info dari GenieACS, memilih profil/VLAN, lalu jalankan provisioning (Create Device, Push Config).
- **PPPoE Push**: Menginput username/password, push config ke GenieACS dengan progress status.
- **Replace ONU**: Alur replacement dari SN lama ke SN baru dengan replikasi konfigurasi secara otomatis (PPPoE, VLAN, WiFi SSID/Password, TR-069, dll) diikuti reboot perangkat.
- **WiFi Configuration**: Mengatur SSID, password, channel, bandwidth, SSID hiding, dan guest WiFi.

### 3.7 Core Logs & Security

- **Event Log**: Logging untuk event sistem (LOS, Dying Gasp, Provision, Factory Reset, Inform, Connection Request, Auth).
- **Audit Log**: Audit trail aktivitas login, logout, provision, replace ONU, push PPPoE, SSID change, delete, role change.

---

## 4. Key Performance Targets

- **API Response**: < 200 ms.
- **Dashboard Load**: < 2 detik.
- **Realtime Delay**: < 1 detik.
- **Scale**: Support 10,000+ ONU & 100+ Concurrent Users.
