import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	NodeConnectionType,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class I95Dev implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'i95Dev',
		name: 'i95Dev',
		icon: 'file:i95dev.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with i95Dev API for eCommerce integration',
		defaults: {
			name: 'i95Dev',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'i95DevApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'ERP Actions',
						value: 'erpactions',
					},
				],
				default: 'erpactions',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['erpactions'],
					},
				},
				options: [
					{
						name: 'Create Customer',
						value: 'createCustomer',
						action: 'Create Customer in BC',
					},
				],
				default: 'createCustomer',
			},
			{
				displayName: 'Packet Size',
				name: 'packetSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createCustomer'],
						resource: ['erpactions'],
					},
				},
				default: 5,
				description: 'Number of records to process in each packet',
			},
			{
				displayName: 'Type',
				name: 'addDataType',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createCustomer'],
						resource: ['erpactions'],
					},
				},
				default: '',
				description: 'Optional type field for create customer data operation',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any = {};

				if (resource === 'erpactions') {
					if (operation === 'createCustomer') {
						try {
							// Function to transform i95Dev customer data to Business Central format
							function transformCustomerData(sourceData: any): any {
								try {
									// Type definitions for better type safety
									type IncomingAddress = {
										firstName?: string;
										lastName?: string;
										postcode?: string;
										regionId?: string;
										city?: string;
										countryId?: string;
										street?: string;
										street2?: string;
										telephone?: string;
										isDefaultBilling?: boolean;
										isDefaultShipping?: boolean;
									};

									type IncomingPayload = {
										sourceId?: string;
										targetCustomerId?: string | null;
										targetId?: string | null;
										email?: string;
										firstName?: string;
										lastName?: string;
										reference?: string;
										addresses?: IncomingAddress[];
										origin?: string;
									};

									type TargetPayload = {
										displayName: string;
										type: "Company";
										addressLine1: string;
										city: string;
										state: string;
										country: string;
										postalCode: string;
										phoneNumber: string;
										email: string;
										website: string;
										taxLiable: boolean;
									};

									function mapIncomingToTarget(input: IncomingPayload): TargetPayload {
										const displayName = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim();

										const addresses = input.addresses ?? [];
										const addr =
											addresses.find(a => a.isDefaultBilling) ??
											addresses.find(a => a.isDefaultShipping) ??
											addresses[0] ?? {};

										const sanitizePhone = (p?: string) => (p ? p.replace(/[^\d+]/g, "") : "");
										const normalizeWebsite = (origin?: string) => {
											if (!origin) return "";
											if (/^https?:\/\//i.test(origin)) return origin;
											if (/\./.test(origin) && !origin.includes(" ")) {
												return `https://${origin}`;
											}
											return `https://${origin}.com`;
										};

										return {
											displayName: displayName || "",
											type: "Company",
											addressLine1: addr.street ?? "",
											city: addr.city ?? "",
											state: addr.regionId ?? "",
											country: addr.countryId ?? "",
											postalCode: addr.postcode ?? "",
											phoneNumber: sanitizePhone(addr.telephone),
											email: input.email ?? "",
											website: normalizeWebsite(input.origin),
											taxLiable: true
										};
									}

									// Handle both single object and array of objects
									const customers = Array.isArray(sourceData) ? sourceData : [sourceData];
									
									return customers.map((customer: any) => {
										// Access the actual customer data - inputData might be a JSON string
										let customerData: IncomingPayload;
										
										console.log('Raw customer object:', JSON.stringify(customer, null, 2));
										
										if (customer.inputData) {
											// If inputData is a string, parse it as JSON
											if (typeof customer.inputData === 'string') {
												try {
													customerData = JSON.parse(customer.inputData);
													console.log('Parsed inputData from string:', JSON.stringify(customerData, null, 2));
												} catch (parseError) {
													console.log('Failed to parse inputData string:', customer.inputData);
													customerData = customer.inputData;
												}
											} else {
												customerData = customer.inputData;
												console.log('Using inputData object directly:', JSON.stringify(customerData, null, 2));
											}
										} else {
											customerData = customer;
											console.log('Using customer object directly:', JSON.stringify(customerData, null, 2));
										}
										
										console.log('Final customerData for mapping:', JSON.stringify(customerData, null, 2));
										
										// Use the new mapping function
										const transformedCustomer = mapIncomingToTarget(customerData);
										
										console.log('Transformed Customer:', JSON.stringify(transformedCustomer, null, 2));
										
										return transformedCustomer;
									});
									
								} catch (error) {
									throw new Error(`Data transformation failed: ${(error as Error).message}`);
								}
							}

							// Get credentials and parameters
							const credentials = await this.getCredentials('i95DevApi');
							const packetSize = this.getNodeParameter('packetSize', i) as number;
							
							// Use empty array as default requestData since parameter was removed
							const requestData = [];
							
							// First, pull the customer data from i95Dev
							const dataType = 'Customer';
							
// Step 1: Get Bearer Token using Refresh Token
const tokenRequestPayload: IHttpRequestOptions = {
  method: 'POST',
  url: `${credentials.baseUrl}/api/client/Token`,
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    refreshToken: credentials.refreshToken,
  },
  json: true,
};
console.log('🔹 Token Request Payload:', JSON.stringify(tokenRequestPayload, null, 2));

const tokenResponse = await this.helpers.httpRequest(tokenRequestPayload);
console.log('✅ Token Response:', JSON.stringify(tokenResponse, null, 2));

const bearerToken = tokenResponse?.accessToken?.token;
// Step 2: Get Scheduler ID
const schedulerRequestPayload: IHttpRequestOptions = {
  method: 'POST',
  url: `${credentials.baseUrl}/api/Index`,
  headers: {
    Authorization: `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  },
  body: {
    context: {
      clientId: credentials.clientId,
      subscriptionKey: credentials.subscriptionKey,
      instanceType: credentials.instanceType,
      schedulerType: 'PullData',
      requestType: 'Source',
      endpointCode: credentials.endpointCode,
    },
  },
  json: true,
};
console.log('🔹 Scheduler Request Payload:', JSON.stringify(schedulerRequestPayload, null, 2));

const schedulerResponse = await this.helpers.httpRequest(schedulerRequestPayload);
console.log('✅ Scheduler Response:', JSON.stringify(schedulerResponse, null, 2));

const schedulerId = schedulerResponse?.schedulerId;
console.log('📌 Extracted Scheduler ID:', schedulerId);



// Step 3: Pull Customer Data from i95Dev
const pullRequestBody = {
	Context: {
		ClientId: credentials.clientId,
		SubscriptionKey: credentials.subscriptionKey,
		InstanceType: credentials.instanceType,
		EndpointCode: credentials.endpointCodeBC,
		isNotEncrypted: true,
		SchedulerType: 'PullData',
		RequestType: 'Source',
		SchedulerId: schedulerId,
	},
	RequestData: [],
	PacketSize: packetSize,
	type: null,
};

const pullRequestPayload: IHttpRequestOptions = {
	method: 'POST',
	url: `${credentials.baseUrl}/api/${dataType}/PullData`,
	headers: {
		Authorization: `Bearer ${bearerToken}`,
		'Content-Type': 'application/json',
	},
	body: pullRequestBody,
	json: true,
};

console.log('🔹 Pull Request Payload:', JSON.stringify(pullRequestPayload, null, 2));

const pullResponse = await this.helpers.httpRequest(pullRequestPayload);

console.log('✅ Pull Response:', JSON.stringify(pullResponse, null, 2));


							// Step 4: Transform the pulled data to Business Central format
							let transformedCustomers = [];
							console.log('Pull Response:', JSON.stringify(pullResponse, null, 2)); // Debug log
							
							// Handle different response formats from i95Dev API
							let customerData = null;
							if (pullResponse) {
								// Check various possible response structures
								if (Array.isArray(pullResponse)) {
									customerData = pullResponse;
								} else if (pullResponse.resultData && Array.isArray(pullResponse.resultData)) {
									customerData = pullResponse.resultData;
								} else if (pullResponse.data && Array.isArray(pullResponse.data)) {
									customerData = pullResponse.data;
								} else if (pullResponse.result && Array.isArray(pullResponse.result)) {
									customerData = pullResponse.result;
								} else if (pullResponse.customers && Array.isArray(pullResponse.customers)) {
									customerData = pullResponse.customers;
								} else if (pullResponse.items && Array.isArray(pullResponse.items)) {
									customerData = pullResponse.items;
								} else if (typeof pullResponse === 'object') {
									// If it's a single customer object, wrap it in an array
									customerData = [pullResponse];
								}
							}
							
							if (customerData && customerData.length > 0) {
								transformedCustomers = transformCustomerData(customerData);
							} else {
								// Provide more detailed error information
								responseData = {
									success: false,
									message: 'No customer data received from i95Dev API',
									pullResponse: pullResponse,
									pullRequestBody: pullRequestBody,
									debug: {
										responseType: typeof pullResponse,
										isArray: Array.isArray(pullResponse),
										hasData: pullResponse?.data ? 'yes' : 'no',
										hasResult: pullResponse?.result ? 'yes' : 'no',
										hasCustomers: pullResponse?.customers ? 'yes' : 'no',
										hasItems: pullResponse?.items ? 'yes' : 'no',
									},
									timestamp: new Date().toISOString(),
								};
								// Don't continue with Business Central operations if no data
								const executionData = this.helpers.constructExecutionMetaData(
									this.helpers.returnJsonArray(responseData),
									{ itemData: { item: i } }
								);
								returnData.push(...executionData);
								continue; // Skip to next iteration
							}

							// Step 5: Create customers in Business Central and prepare push response data
							const results = [];
							const pushResponseData = [];
							
							// Create a mapping of customer data to original pulled data for messageId and sourceId
							const customerToPulledDataMap = new Map();
							if (customerData && Array.isArray(customerData)) {
								customerData.forEach((pulledItem) => {
									// Use email or reference as key to match with transformed customer
									const key = pulledItem.email || pulledItem.reference;
									if (key) {
										customerToPulledDataMap.set(key, {
											messageId: pulledItem.messageId,
											sourceId: pulledItem.sourceId
										});
									}
								});
							}
							
							for (const transformedCustomer of transformedCustomers) {
								try {
									// Get Business Central OAuth token
									const tenantId = credentials.tenantId as string;
									const clientId = credentials.clientIdBC as string;
									const clientSecret = credentials.clientSecretBC as string;
									
									const tokenRequestBody = new URLSearchParams({
										grant_type: 'client_credentials',
										client_id: String(clientId),
										client_secret: String(clientSecret),
										scope: 'https://api.businesscentral.dynamics.com/.default'
									});

									const bcTokenResponse = await this.helpers.httpRequest({
										method: 'POST',
										url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
										},
										body: tokenRequestBody.toString(),
										json: false,
									});

									const tokenData = typeof bcTokenResponse === 'string' ? JSON.parse(bcTokenResponse) : bcTokenResponse;
									const bcAccessToken = tokenData.access_token;

									// Get company ID - Use environment from credentials instead of parameter
									const environment = credentials.environment as string || 'N8N';
									const companiesResponse = await this.helpers.httpRequest({
										method: 'GET',
										url: `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies`,
										headers: {
											'Authorization': `Bearer ${bcAccessToken}`,
											'Content-Type': 'application/json',
										},
										json: true,
									});

									const companies = companiesResponse.value || companiesResponse;
									const companyId = companies[0]?.id;

									// Create customer in Business Central
									const createCustomerUrl = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies(${companyId})/customers`;
									
									const customerResponse = await this.helpers.httpRequest({
										method: 'POST',
										url: createCustomerUrl,
										headers: {
											'Authorization': `Bearer ${bcAccessToken}`,
											'Content-Type': 'application/json',
										},
										body: transformedCustomer,
										json: true,
									});

									// Get original pulled data for this customer
									const customerKey = transformedCustomer.email || transformedCustomer.reference;
									const pulledData = customerToPulledDataMap.get(customerKey);
									
									// Map BC response to Push Response format
									const pushResponseItem = {
										sourceId: pulledData?.sourceId || transformedCustomer.reference || '',
										targetId: customerResponse.number || customerResponse.id || '',
										reference: customerResponse.number || '',
										message: `Customer created successfully in Business Central with number: ${customerResponse.number}`,
										result: true,
										inputData: JSON.stringify(transformedCustomer),
										messageId: pulledData?.messageId || 0,
										statusId: 1, // Success status
										lastSyncTime: new Date().toISOString(),
										additionalProp1: customerResponse.displayName || '',
										additionalProp2: customerResponse.email || '',
										additionalProp3: customerResponse.id || '',
									};

									pushResponseData.push(pushResponseItem);

									results.push({
										success: true,
										originalData: transformedCustomer.reference || transformedCustomer.email,
										transformedData: transformedCustomer,
										bcResponse: customerResponse,
										pushResponseMapping: pushResponseItem,
									});

								} catch (customerError) {
									// Get original pulled data for this customer (for error case too)
									const customerKey = transformedCustomer.email || transformedCustomer.reference;
									const pulledData = customerToPulledDataMap.get(customerKey);
									
									// Create error response for push response
									const errorPushResponseItem = {
										sourceId: pulledData?.sourceId || transformedCustomer.reference || '',
										targetId: '',
										reference: '',
										message: `Error creating customer in Business Central: ${(customerError as Error).message}`,
										result: false,
										inputData: JSON.stringify(transformedCustomer),
										messageId: pulledData?.messageId || 0,
										statusId: 0, // Error status
										lastSyncTime: new Date().toISOString(),
										additionalProp1: '',
										additionalProp2: '',
										additionalProp3: '',
									};

									pushResponseData.push(errorPushResponseItem);

									results.push({
										success: false,
										originalData: transformedCustomer.reference || transformedCustomer.email,
										transformedData: transformedCustomer,
										error: (customerError as Error).message,
										pushResponseMapping: errorPushResponseItem,
									});
								}
							}

							// Step 6: Push Response back to i95Dev API
							let pushResponseResult = null;
							if (pushResponseData.length > 0) {
								try {
									// Get new scheduler ID for push response
									const pushSchedulerResponse = await this.helpers.httpRequest({
										method: 'POST',
										url: `${credentials.baseUrl}/api/Index`,
										headers: {
											'Authorization': `Bearer ${bearerToken}`,
											'Content-Type': 'application/json',
										},
										body: {
											context: {
												clientId: credentials.clientId,
												subscriptionKey: credentials.subscriptionKey,
												instanceType: credentials.instanceType,
												schedulerType: 'PushResponse',
												requestType: 'Source',
												endpointCode: credentials.endpointCodeBC,
											},
										},
										json: true,
									});

									const pushSchedulerId = pushSchedulerResponse.schedulerId;

									// Push response data
									const pushRequestBody = {
										context: {
											clientId: credentials.clientId,
											subscriptionKey: credentials.subscriptionKey,
											instanceType: credentials.instanceType,
											schedulerType: 'PushResponse',
											endPointCode: credentials.endpointCodeBC,
											schedulerId: pushSchedulerId,
											isNotEncrypted: true,
										},
										packetSize: packetSize,
										requestData: pushResponseData,
									};

									pushResponseResult = await this.helpers.httpRequest({
										method: 'POST',
										url: `${credentials.baseUrl}/api/Customer/PushResponse`,
										headers: {
											'Authorization': `Bearer ${bearerToken}`,
											'Content-Type': 'application/json',
										},
										body: pushRequestBody,
										json: true,
									});

								} catch (pushError) {
									pushResponseResult = {
										error: `Failed to push response: ${(pushError as Error).message}`,
										success: false,
									};
								}
							}

							responseData = {
								success: true,
								message: `Processed ${transformedCustomers.length} customers from i95Dev API and pushed response back`,
								pulledData: pullResponse,
								transformedData: transformedCustomers,
								businessCentralResults: results,
								pushResponseData: pushResponseData,
								pushResponseResult: pushResponseResult,
								successCount: results.filter(r => r.success).length,
								errorCount: results.filter(r => !r.success).length,
								timestamp: new Date().toISOString(),
							};

						} catch (apiError) {
							responseData = {
								success: false,
								message: 'i95Dev API - Error in create customer workflow',
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } }
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } }
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

}
