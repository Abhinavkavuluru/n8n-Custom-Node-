import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class I95DevApi implements ICredentialType {
	name = 'i95DevApi';
	displayName = 'i95Dev API';
	documentationUrl = 'https://docs.i95dev.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Refresh token for i95Dev API authentication (used to get Bearer token dynamically)',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your i95Dev Client ID',
		},
		{
			displayName: 'Subscription Key',
			name: 'subscriptionKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your i95Dev Subscription Key',
		},
		{
			displayName: 'Instance Type',
			name: 'instanceType',
			type: 'options',
			options: [
				{
					name: 'Staging',
					value: 'Staging',
				},
				{
					name: 'Production',
					value: 'Production',
				},
			],
			default: 'Staging',
			description: 'The environment type',
		},
		{
			displayName: 'Endpoint Code of Magento',
			name: 'endpointCode',
			type: 'string',
			default: '',
			required: true,
			description: 'Your i95Dev Endpoint Code for Magento',
		},
		{
			displayName: 'Endpoint Code of BC',
			name: 'endpointCodeBC',
			type: 'string',
			default: '',
			required: true,
			description: 'Your i95Dev Endpoint Code for Business Central',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://clouddev2api.i95-dev.com',
			required: true,
			description: 'The base URL for your i95Dev API (e.g., https://clouddev2api.i95-dev.com)',
			placeholder: 'https://clouddev2api.i95-dev.com',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: false,
			description: 'Azure AD Tenant ID for Business Central authentication',
		},
		{
			displayName: 'Client ID (BC)',
			name: 'clientIdBC',
			type: 'string',
			default: '',
			required: false,
			description: 'Azure App Registration Client ID for Business Central',
		},
		{
			displayName: 'Client Secret (BC)',
			name: 'clientSecretBC',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'Azure App Registration Client Secret for Business Central',
		},
		{
			displayName: 'Environment Name',
			name: 'environment',
			type: 'string',
			default: 'N8N',
			required: false,
			description: 'Business Central environment name (e.g., N8N, Production, Sandbox)',
		},
	];

	// No static authentication since we'll handle token dynamically
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/client/Token',
			method: 'POST',
			body: {
				refreshToken: '={{$credentials.refreshToken}}',
			},
		},
	};
}
