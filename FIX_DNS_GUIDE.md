# Quick Fix for Supabase Connection Issue

## 🔴 Problem
Your system is using IPv6 DNS servers which causes connection failures to Supabase.

## ✅ Solution: Change DNS to Google DNS (Forces IPv4)

### Method 1: Windows Settings (Easiest)

1. **Open Windows Settings** → Network & Internet → Wi-Fi → vivo Y17s
2. **Click "Edit"** next to "DNS server assignment: Automatic (DHCP)"
3. **Select "Manual"**
4. **Turn on IPv4**
5. **Enter these DNS servers:**
   - Preferred DNS: `8.8.8.8`
   - Alternate DNS: `8.8.4.4`
6. **Turn off IPv6** (optional but recommended)
7. **Click "Save"**

### Method 2: PowerShell (Requires Admin)

1. **Right-click PowerShell** → Run as Administrator
2. **Run this command:**
   ```powershell
   Get-NetAdapter -Name "Wi-Fi" | Set-DnsClientServerAddress -ServerAddresses ("8.8.8.8","8.8.4.4")
   ```

### Method 3: Use the Batch File

1. **Right-click `fix-supabase-dns.bat`** in your project folder
2. **Select "Run as Administrator"**
3. This will add Supabase IP mapping to your hosts file

## 🧪 Test After Changing DNS

1. **Open PowerShell** and run:
   ```powershell
   Test-NetConnection -ComputerName akdtdktgaomceflvvxxy.supabase.co -Port 443
   ```
   
2. **You should see:**
   - `TcpTestSucceeded: True`
   - `PingSucceeded: True`

3. **Restart your backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

4. **Test the health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```
   
   Should return: `{"status":"ok","database":"connected"}`

## 🎯 Why This Works

- Your current DNS uses IPv6 which times out when connecting to Supabase
- Google DNS (8.8.8.8) forces IPv4 resolution
- Supabase servers are reachable via IPv4 (104.18.38.10)
- This fixes both admin login and contact form submission

## 🔄 After DNS Change

1. **Restart backend server**
2. **Hard refresh browser** (Ctrl + Shift + R)
3. **Try logging in** with:
   - Username: `adminnaturalfarmsira`
   - Password: `Admin@123456`
4. **Test contact form** on the frontend

## ⚠️ Alternative: Use Mobile Hotspot

If you can't change DNS settings:
1. Enable mobile hotspot on your phone
2. Connect your laptop to the hotspot
3. Restart the backend server
4. Mobile networks typically use IPv4 which will work

## 📝 To Revert DNS Later

If you want to go back to automatic DNS:
1. Go to Windows Settings → Network & Internet → Wi-Fi → vivo Y17s
2. Click "Edit" next to DNS server assignment
3. Select "Automatic (DHCP)"
4. Click "Save"
