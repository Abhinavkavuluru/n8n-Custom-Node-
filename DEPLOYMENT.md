# i95Dev Custom Node - Internal Company Deployment Guide

## 📦 Package Overview
This is a private n8n custom node for i95Dev API integration, prepared for internal company deployment.

## 🏗️ Build & Package Instructions

### 1. Build the Node
```bash
# Install dependencies
npm install

# Build TypeScript and compile assets
npm run build

# Create deployment package
npm run package
```

### 2. Verify Build Structure
After building, ensure the following structure exists:
```
dist/
├── credentials/
│   ├── I95DevApi.credentials.js
│   └── I95DevApi.credentials.d.ts
└── nodes/
    └── I95Dev/
        ├── I95Dev.node.js
        ├── I95Dev.node.d.ts
        └── i95dev.svg
```

## 🚀 Deployment Methods

### Method 1: Direct File Copy (Recommended)
1. **Copy built files to n8n server:**
   ```bash
   # Copy the entire dist folder to n8n custom directory
   cp -r dist/ ~/.n8n/custom/
   ```

2. **For Docker-based n8n:**
   ```bash
   # Copy to mounted volume
   cp -r dist/ /path/to/n8n/custom/
   ```

### Method 2: NPM Package Installation
1. **Create package:**
   ```bash
   npm run package
   # This creates: n8n-nodes-i95dev-0.1.0.tgz
   ```

2. **Install on target server:**
   ```bash
   # Install from local package
   npm install /path/to/n8n-nodes-i95dev-0.1.0.tgz
   
   # Or install globally
   npm install -g /path/to/n8n-nodes-i95dev-0.1.0.tgz
   ```

### Method 3: Custom Extensions Directory
1. **Set environment variable on target server:**
   ```bash
   export N8N_CUSTOM_EXTENSIONS="/path/to/customnode"
   ```

2. **Copy entire project folder:**
   ```bash
   cp -r /path/to/customnode /target/server/path/
   ```

## 🖥️ Server Setup Instructions

### For Native n8n Installation:
1. **Stop n8n service**
2. **Copy files to:** `~/.n8n/custom/`
3. **Restart n8n service**

### For Docker-based n8n:
1. **Stop container**
2. **Copy files to mounted custom directory**
3. **Restart container with:**
   ```bash
   docker run -d \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     -v /path/to/custom:/home/node/.n8n/custom \
     n8nio/n8n
   ```

### For Kubernetes/Production:
1. **Create ConfigMap or Volume with custom node files**
2. **Mount to:** `/home/node/.n8n/custom/`
3. **Restart n8n pods**

## 🔧 Configuration

### Credentials Setup:
Users will need to configure:
- **Base URL**: Your i95Dev API endpoint
- **Refresh Token**: Authentication token
- **Client ID**: Your client identifier
- **Subscription Key**: API subscription key
- **Instance Type**: Staging/Production
- **Endpoint Code**: Your endpoint code

### Environment Variables (Optional):
```bash
# If using custom extensions directory
N8N_CUSTOM_EXTENSIONS="/path/to/customnode"

# For production
N8N_RUNNERS_ENABLED=true
```

## ✅ Verification Steps

1. **Check node appears in n8n:**
   - Search for "i95dev" in node palette
   - Verify all 24 operations are available

2. **Test credentials:**
   - Create new i95Dev credentials
   - Test connection using "Test" button

3. **Test workflow:**
   - Create simple workflow with i95Dev node
   - Execute and verify API responses

## 📁 File Structure for Deployment

### Essential Files:
```
dist/
├── credentials/
│   └── I95DevApi.credentials.js    # Credential configuration
└── nodes/
    └── I95Dev/
        ├── I95Dev.node.js          # Main node logic
        └── i95dev.svg              # Node icon
```

### Package Files (if using npm method):
- `package.json` - Node metadata and dependencies
- `n8n-nodes-i95dev-0.1.0.tgz` - Packaged node

## 🔒 Security Considerations

- **Private Use Only**: This node is for internal company use
- **Secure Credentials**: Store API tokens securely
- **Network Access**: Ensure server can reach i95Dev API endpoints
- **Firewall Rules**: Configure appropriate access controls

## 🐛 Troubleshooting

### Node Not Appearing:
1. Check file permissions in custom directory
2. Verify n8n has read access to files
3. Restart n8n service completely
4. Check n8n logs for loading errors

### API Connection Issues:
1. Verify Base URL in credentials
2. Test network connectivity to API endpoint
3. Validate authentication tokens
4. Check firewall/proxy settings

### Build Issues:
1. Ensure TypeScript compiles without errors
2. Verify all dependencies are installed
3. Check gulp build process for icon copying

## 📞 Support

For internal deployment issues:
1. Check n8n server logs
2. Verify file structure matches requirements
3. Test credentials configuration
4. Validate API endpoint accessibility

---

**Ready for Production**: This package is prepared for immediate deployment to your company's n8n infrastructure.
