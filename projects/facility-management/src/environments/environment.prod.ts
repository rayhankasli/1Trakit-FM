
export const environment = {
  production: true,
  /// 1Authority config
  client_id: '1TrakItFM',
  scope: 'openid profile UserProfile 1TrakItFMApi 1RPPPolicyServerApi 1AuthorityApi',
  response_type: 'id_token token',
  authority: 'https://1auth.1rivet.com/',
  redirect_uri: 'https://1trakit-fmv2.1rivet.com/',
  acr_values: 'tenant:92E838C3-EC40-486F-B126-BBEC78E7D99B',
  ui_locales: 'en-US',
  // Policy server config
  policy_url: 'https://policy.1rivet.com/api/userPolicy',
  policy_name: '1TrakItFMPolicy',
  // Api URL
  baseUrl: 'https://1trakit-fmv2-services.1rivet.com/api/',
  // Used to load images from server
  base_host_url: 'https://1trakit-fmv2-services.1rivet.com/Files/',
  // current API version
  api_version: '1.0',
};
