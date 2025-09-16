# i95Dev n8n Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [What Was Implemented](#what-was-implemented)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [How to Use the Custom Node](#how-to-use-the-custom-node)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

## Overview
This document provides a comprehensive guide to the custom n8n node created for i95Dev's API integration. The node allows you to pull product data from i95Dev's API directly within your n8n workflows.

## What Was Implemented

1. **Custom Node for i95Dev API**
   - Added "Pull Product Data" operation
   - Implemented secure credential management
   - Added proper error handling and response formatting

2. **Credential Configuration**
   - Secure storage for Bearer Token, Client ID, and other sensitive data
   - Input validation for all required fields
   - Test connection functionality

3. **API Integration**
   - Direct integration with `https://clouddev2api.i95-dev.com/api/Product/PullData`
   - Support for custom request data
   - Configurable packet size for data retrieval

## Project Structure

```
customnode/
├── credentials/
│   └── I95DevApi.credentials.ts  # Credential configuration
├── dist/
│   ├── I95DevApi.credentials.js  # Compiled credentials
│   ├── I95Dev.node.js            # Compiled node
│   └── i95dev.svg                # Node icon
├── nodes/
│   └── I95Dev/
│       └── I95Dev.node.ts        # Main node implementation
├── .eslintrc.js                  # ESLint configuration
├── .gitignore
├── .prettierrc.js               # Prettier configuration
├── gulpfile.js                  # Build configuration
├── index.js                     # Node entry point
├── package.json                 # Project configuration
└── tsconfig.json               # TypeScript configuration
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)
- n8n installed globally or as a service

### Installation Steps

1. **Clone or extract the project**
   ```bash
   git clone <repository-url> customnode
   cd customnode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```
   This will compile the TypeScript files and copy necessary assets to the `dist` directory.

4. **Link the custom node to n8n**
   ```bash
   # In the project directory
   npm link
   
   # In your n8n installation directory
   npm link n8n-nodes-i95dev
   ```

5. **Start n8n with custom extensions**
   ```bash
   # On Windows
   $env:N8N_CUSTOM_EXTENSIONS="c:\path\to\customnode"; n8n start
   
   # On Linux/Mac
   N8N_CUSTOM_EXTENSIONS="/path/to/customnode" n8n start
   ```

## How to Use the Custom Node

1. **Add the node to your workflow**
   - Click the "+" button to add a new node
   - Search for "i95Dev"
   - Select the "i95Dev" node

2. **Configure credentials**
   - Click on the node to open its settings
   - Click on "Create New" under Credentials
   - Fill in the required fields:
     - Bearer Token
     - Client ID
     - Subscription Key
     - Instance Type (Staging/Production)
     - Endpoint Code
     - Scheduler ID
   - Click "Save"

3. **Configure the node**
   - Select "eCommerce" as the resource
   - Select "Pull Product Data" as the operation
   - Configure the following parameters:
     - Packet Size: Number of records to pull (default: 5)
     - Request Data: Additional data as a JSON array (default: `[]`)

4. **Execute the workflow**
   - Click "Execute Node" to test
   - The response will appear in the output panel

## Troubleshooting

### Node not appearing in n8n
1. Ensure n8n was started with the correct `N8N_CUSTOM_EXTENSIONS` environment variable
2. Check the n8n logs for any loading errors
3. Verify the node is properly linked in both the project and n8n directories

### Authentication errors
1. Verify the Bearer Token is correct and hasn't expired
2. Check that all required credential fields are filled in
3. Ensure the Instance Type matches your environment (Staging/Production)

### API connection issues
1. Verify the API endpoint is accessible from your network
2. Check that the Client ID and Subscription Key are correct
3. Ensure the Scheduler ID is valid for your account

## API Reference

### Pull Product Data
- **Endpoint**: `POST /api/Product/PullData`
- **Authentication**: Bearer Token
- **Request Body**:
  ```json
  {
    "Context": {
      "ClientId": "your-client-id",
      "SubscriptionKey": "your-subscription-key",
      "InstanceType": "Staging|Production",
      "EndpointCode": "your-endpoint-code",
      "isNotEncrypted": true,
      "SchedulerType": "PullData",
      "RequestType": "Source",
      "SchedulerId": 12345678
    },
    "RequestData": [],
    "PacketSize": 5,
    "type": null
  }
  ```

### Response Format
```json
{
  "success": true,
  "message": "i95Dev API - Product Data Pulled Successfully",
  "apiResponse": {
    /* API response data */
  },
  "requestBody": {
    /* The request that was sent */
  },
  "timestamp": "2023-01-01T12:00:00.000Z"
}
```

## Support
For any issues or questions, please contact i95Dev support at support@i95dev.com.
