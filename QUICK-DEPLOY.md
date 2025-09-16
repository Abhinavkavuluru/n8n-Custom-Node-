# Quick Deployment Guide - i95Dev Custom Node

## 🚀 Ready for Company Deployment

Your custom node is now cleaned and prepared for internal deployment.

### What Was Removed:
- ❌ `proxy-server.js` - Proxy server file
- ❌ `start-services.bat` - Batch startup file  
- ❌ `deployment-guide.md` - Old proxy deployment guide
- ❌ Proxy dependencies: `http-proxy`, `concurrently`, `cross-env`
- ❌ Proxy scripts: `proxy`, `start:n8n`, `start:both`

### What's Ready:
- ✅ Clean `package.json` with only essential dependencies
- ✅ Proper TypeScript compilation to `dist/` structure
- ✅ Production-ready build system
- ✅ Internal deployment documentation

## 📦 Build & Deploy Commands

### 1. Build the Node
```bash
npm install
npm run build
```

### 2. Create Package (Optional)
```bash
npm run package
# Creates: n8n-nodes-i95dev-0.1.0.tgz
```

### 3. Deploy to Server

**Method A: Direct Copy (Recommended)**
```bash
# Copy built files to n8n custom directory
cp -r dist/ ~/.n8n/custom/
```

**Method B: Package Installation**
```bash
# Install from package
npm install -g n8n-nodes-i95dev-0.1.0.tgz
```

**Method C: Custom Extensions**
```bash
# Set environment variable and copy project
export N8N_CUSTOM_EXTENSIONS="/path/to/customnode"
cp -r . /target/server/path/
```

## 🖥️ Server Setup

### Native n8n:
1. Stop n8n service
2. Copy `dist/` to `~/.n8n/custom/`
3. Restart n8n service

### Docker n8n:
1. Stop container
2. Copy files to mounted custom volume
3. Restart container

### Kubernetes:
1. Create ConfigMap with custom node files
2. Mount to `/home/node/.n8n/custom/`
3. Restart pods

## ✅ Verification

1. Search "i95dev" in n8n node palette
2. Verify all 24 operations available
3. Test credentials connection
4. Execute sample workflow

## 📁 Final Structure

```
customnode/
├── dist/                           # Ready for deployment
│   ├── credentials/
│   │   └── I95DevApi.credentials.js
│   └── nodes/
│       └── I95Dev/
│           ├── I95Dev.node.js
│           └── i95dev.svg
├── package.json                    # Clean, no proxy deps
├── README.md                       # Updated documentation
├── DEPLOYMENT.md                   # Detailed deployment guide
└── QUICK-DEPLOY.md                # This file
```

## 🎯 Ready for Production

Your custom node is now:
- **Proxy-free**: No masking or port forwarding
- **Portable**: Works on any n8n server
- **Company-ready**: Private deployment prepared
- **Zero-config**: Just copy and restart n8n

**Next Step**: Copy the `dist/` folder to your company's n8n server and restart the service.
