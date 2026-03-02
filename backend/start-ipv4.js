const dns = require('dns');

// Force IPv4 resolution
dns.setDefaultResultOrder('ipv4first');

// Set Node.js to prefer IPv4
process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

// Start the application
require('./dist/main.js');