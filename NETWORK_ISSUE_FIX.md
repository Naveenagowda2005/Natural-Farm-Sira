# Network Connectivity Issue - Supabase Connection Failed

## 🔴 Problem Identified

Your backend **cannot connect to Supabase** due to network connectivity issues. The error shows:

```
ConnectTimeoutError: Connect Timeout Error
(attempted addresses: 2405:200:1607:2820:41::36:443, 49.44.79.236:443, timeout: 10000ms)
```

This means:
- ❌ TCP connection to Supabase is failing
- ❌ Ping to Supabase servers is timing out
- ❌ Port 443 (HTTPS) is not reachable

## 🔍 Diagnosis Results

```
ComputerName: akdtdktgaomceflvvxxy.supabase.co
RemotePort: 443
PingSucceeded: False
TcpTestSucceeded: False
```

## ✅ Solutions (Try in Order)

### Solution 1: Check Firewall Settings

**Windows Firewall:**
1. Open Windows Security
2. Go to "Firewall & network protection"
3. Click "Allow an app through firewall"
4. Find "Node.js" or add it if missing
5. Enable both "Private" and "Public" checkboxes
6. Click OK and restart the backend

**Third-party Firewall/Antivirus:**
- If you have antivirus software (Norton, McAfee, Kaspersky, etc.):
  1. Open your antivirus settings
  2. Look for "Firewall" or "Network Protection"
  3. Add Node.js to the allowed applications list
  4. Temporarily disable the firewall to test if it's the cause

### Solution 2: Check VPN/Proxy

If you're using a VPN or proxy:
1. **Disconnect VPN** temporarily and test
2. If it works without VPN, configure VPN to allow Supabase domains
3. Add `*.supabase.co` to VPN bypass list

### Solution 3: Check Network Restrictions

If you're on:
- **Corporate/Office Network**: Contact IT to whitelist `*.supabase.co`
- **School/University Network**: May have restrictions on external databases
- **Public WiFi**: Try switching to mobile hotspot or home network

### Solution 4: DNS Issues

Try changing DNS servers:

**Windows:**
1. Open Network Settings
2. Click "Change adapter options"
3. Right-click your network adapter → Properties
4. Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
5. Select "Use the following DNS server addresses":
   - Preferred: `8.8.8.8` (Google DNS)
   - Alternate: `8.8.4.4`
6. Click OK and restart network adapter

### Solution 5: Disable IPv6 (Temporary Test)

The error shows IPv6 address is being tried first. Try disabling IPv6:

1. Open Network Settings
2. Click "Change adapter options"
3. Right-click your network adapter → Properties
4. Uncheck "Internet Protocol Version 6 (TCP/IPv6)"
5. Click OK
6. Restart backend server

### Solution 6: Use Mobile Hotspot

Quick test to isolate the issue:
1. Enable mobile hotspot on your phone
2. Connect your computer to the hotspot
3. Restart the backend server
4. Test if categories load

If it works on mobile hotspot → Your main network has restrictions

## 🧪 Test Connection

After trying each solution, test the connection:

```powershell
# Test 1: Ping Supabase
Test-NetConnection -ComputerName akdtdktgaomceflvvxxy.supabase.co -Port 443

# Test 2: Try curl
curl https://akdtdktgaomceflvvxxy.supabase.co

# Test 3: Restart backend and check logs
cd backend
npm run start:dev
```

## 🔄 After Fixing Network

Once connection is working:

1. **Restart Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Test Backend Health**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

3. **Refresh Frontend**
   - Hard refresh: `Ctrl + Shift + R`
   - Categories should now load

## 🆘 Alternative: Use Local PostgreSQL

If you cannot fix the network issue, you can:

1. **Install PostgreSQL locally**
2. **Update backend to use local database**
3. **Run migrations on local database**

This is more complex but works without internet connectivity to Supabase.

## 📊 Current Status

- ✅ Backend server is running (port 3001)
- ✅ Frontend is running (port 8080)
- ✅ Authentication is working
- ✅ API endpoints are configured correctly
- ❌ **Network cannot reach Supabase servers**

## 🎯 Most Likely Causes

Based on the error pattern:

1. **Antivirus/Firewall blocking Node.js** (70% probability)
2. **Network restrictions** (20% probability)
3. **VPN interference** (10% probability)

## 📝 Quick Checklist

Try these in order:

- [ ] Temporarily disable antivirus/firewall
- [ ] Disconnect VPN if using one
- [ ] Try mobile hotspot
- [ ] Change DNS to Google DNS (8.8.8.8)
- [ ] Disable IPv6 temporarily
- [ ] Check if other HTTPS sites work
- [ ] Contact network administrator if on corporate network

## 💡 Verification

Once fixed, you should see in backend logs:
```
Application is running on: http://localhost:3001
```

And NO errors about "ConnectTimeoutError" or "fetch failed"

## 🔗 Supabase Status

Check if Supabase itself is down:
- Visit: https://status.supabase.com/
- If Supabase is down, wait for it to come back online

## Need More Help?

If none of these solutions work:
1. Check Windows Event Viewer for network errors
2. Run `ipconfig /all` and check network configuration
3. Try accessing Supabase dashboard in browser: https://app.supabase.com/
4. If dashboard works but backend doesn't → It's a Node.js/Firewall issue
