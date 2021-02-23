// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // 1Authority config
  client_id: '1TrakItFM',
  scope: 'openid profile UserProfile 1TrakItFMAPI 1RPPPolicyServerApi 1AuthorityApi',
  response_type: 'id_token token',
  authority: 'https://dev-1auth.1rivet.com/',
  redirect_uri: 'http://localhost:4200/',
  acr_values: 'tenant:92E838C3-EC40-486F-B126-BBEC78E7D88B',
  ui_locales: 'en-US',
  // Policy server config
  policy_url: 'https://dev-policy.1rivet.com/api/userPolicy',
  policy_name: '1TrakItFMPolicy',
  // Api URL
  baseUrl: 'https://dev-1tfmv2-services.1rivet.com/api/',
  // baseUrl: 'http://localhost:3000/'
  // Used to load images from server
  base_host_url: 'https://dev-1tfmv2-services.1rivet.com/Files/',
  // current API version
  api_version: '1.0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
