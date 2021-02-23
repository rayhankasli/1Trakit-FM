

export const environment = {
  production: false,
  /// 1Authority config
  client_id: '1TrakItFMUAT',
  scope: 'openid profile UserProfile 1TrakItFMAPI 1RPPPolicyServerApi 1AuthorityApi',
  response_type: 'id_token token',
  authority: 'https://dev-1auth.1rivet.com/',
  redirect_uri: 'https://uat-1tfmv2.1rivet.com/',
  acr_values: 'tenant:92E838C3-EC40-486F-B126-BBEC78E7D89B',
  ui_locales: 'en-US',
  // Policy server config
  policy_url: 'https://dev-policy.1rivet.com/api/userPolicy',
  policy_name: '1TrakItFMPolicyUAT',
  // Api URL
  baseUrl: 'https://uat-1tfmv2-services.1rivet.com/api/',
  // Used to load images from server
  base_host_url: 'https://uat-1tfmv2-services.1rivet.com/Files/',
  // current API version
  api_version: '1.0',
};
