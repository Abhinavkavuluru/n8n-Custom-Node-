# i95Dev Custom Node for n8n

![i95Dev Logo](nodes/I95Dev/i95dev.svg)

A custom n8n node that provides seamless integration with i95Dev's eCommerce integration platform. This node enables users to interact with i95Dev's API for pulling and pushing product data, customer information, sales orders, invoices, shipments, and inventory data directly within n8n workflows.

## 🚀 Features

- **Full eCommerce Data Management**: Support for Products, Customers, Sales Orders, Invoices, Shipments, and Inventory
- **Bi-directional Data Flow**: Both pull and push operations for all data types
- **Message Queue Integration**: Pull and push response operations for complete data lifecycle management
- **Secure Authentication**: Uses refresh token to dynamically obtain bearer tokens
- **Flexible Configuration**: Configurable packet sizes and custom request data
- **Multiple Environment Support**: Works with both Staging and Production environments
- **Real-time & Batch Sync**: Support for both real-time and batch data synchronization
- **Custom Icon**: Branded i95Dev icon for easy identification in workflows

## 📋 Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)
- n8n installed (self-hosted or n8n Cloud)
- i95Dev API credentials (Refresh Token, Client ID, Subscription Key, Endpoint Code)

## 🛠 Installation

### Method 1: Install from npm (Recommended)
```bash
npm install n8n-nodes-i95dev
```

### Method 2: Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Abhinavkavuluru/Custom_node_n8n.git
   cd Custom_node_n8n
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Link to your n8n installation:
   ```bash
   npm link
   # Then in your n8n directory
   npm link n8n-nodes-i95dev
   ```

## 🔧 Configuration

### Setting up Credentials

1. In n8n, create new credentials for "i95Dev API"
2. Fill in the required fields:
   - **Refresh Token**: Your i95Dev refresh token
   - **Client ID**: Your i95Dev client identifier
   - **Subscription Key**: Your i95Dev subscription key
   - **Instance Type**: Choose between "Staging" or "Production"
   - **Endpoint Code**: Your specific endpoint code

### Environment Variables (for self-hosted n8n)

If you're running n8n locally, start it with the custom node:

```bash
# Windows PowerShell
$env:N8N_CUSTOM_EXTENSIONS="path\to\your\node"; n8n start

# Linux/Mac
N8N_CUSTOM_EXTENSIONS="/path/to/your/node" n8n start
```

## 📖 Usage

### Available Resources

#### 1. eCommerce Operations
- **Pull Operations**: Pull data from i95Dev API
  - Pull Product Data
  - Pull Customer Data
  - Pull Sales Order Data
  - Pull Invoice Data
  - Pull Shipment Data
  - Pull Inventory Data

- **Push Operations**: Send data to i95Dev API
  - Push Product Data
  - Push Customer Data
  - Push Sales Order Data
  - Push Invoice Data
  - Push Shipment Data
  - Push Inventory Data

- **Response Operations**: Handle message queue responses
  - Pull/Push Product Response
  - Pull/Push Customer Response
  - Pull/Push Sales Order Response
  - Pull/Push Invoice Response
  - Pull/Push Shipment Response
  - Pull/Push Inventory Response

#### 2. Integration Operations
- Connect Systems
- Map Data Fields

#### 3. Data Sync Operations
- Real-time Sync
- Batch Sync

### Example Workflow

1. **Add the i95Dev node** to your workflow
2. **Select Resource**: Choose "eCommerce"
3. **Select Operation**: Choose "Pull Product Data"
4. **Configure Parameters**:
   - Packet Size: 10 (number of records per request)
   - Request Data: `[]` (additional request parameters)
5. **Execute** the workflow

### Sample Request Data Format

For push operations, use JSON format:
```json
[
  {
    "TargetId": "C00180",
    "SourceId": "16",
    "MagentoId": null,
    "Reference": "16",
    "MessageId": null,
    "Message": null,
    "Status": null,
    "InputData": "{\"sourceId\":\"16\",\"targetCustomerId\":\"C00180\"}"
  }
]
```

## 🏗 Project Structure

```
├── credentials/
│   └── I95DevApi.credentials.ts    # API credential configuration
├── nodes/
│   └── I95Dev/
│       ├── I95Dev.node.ts          # Main node implementation
│       └── i95dev.svg              # Custom node icon
├── dist/                           # Compiled output (auto-generated)
├── gulpfile.js                     # Build configuration
```

## 🔒 Security

- Private node for internal use only
- Secure credential storage required
- Network access to i95Dev API endpoints needed

## 📞 Support

For deployment issues, refer to [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: contact@i95dev.com
- **Documentation**: [i95Dev API Documentation](https://docs.i95dev.com)
- **Issues**: [GitHub Issues](https://github.com/Abhinavkavuluru/Custom_node_n8n/issues)

## 🏷 Version History

- **v0.1.0**: Initial release with full eCommerce integration support
- Comprehensive API operations for all major eCommerce data types
- Secure authentication with refresh token
- Message queue response handling
- Multi-environment support

## 🎯 Roadmap

- [ ] Add more eCommerce platform integrations
- [ ] Enhanced error handling and logging
- [ ] Bulk operation support
- [ ] Real-time webhook support
- [ ] Advanced data transformation options

---

Made with ❤️ by [i95Dev](https://i95dev.com) for the n8n community.
