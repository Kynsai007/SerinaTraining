// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let apiUrlString = "";
if(location.href.includes("agifsscinvoiceportal")){
  if(location.href.includes("dev")){
    apiUrlString = "agiv2";
  } else if(location.href.includes("uat")){
    apiUrlString = "agiv2uat";
  } else {
    apiUrlString = "agiv2prod";
  }
} else if(!location.href.includes("localhost")) {
  apiUrlString = `${location.href.split("https://")[1].split(".serinaplus.com")[0]}`;
}

export const environment = {
  production: false,
  // apiUrl:"https://cenomidev.centralindia.cloudapp.azure.com",
  // apiUrl:"http://127.0.0.1:8000",
  
  apiUrl: `https://${apiUrlString}.centralindia.cloudapp.azure.com`,

  apiVersion: "apiv1.1",
  userData: JSON.parse(localStorage.getItem('currentLoginUser')),
  userName: JSON.parse(localStorage.getItem('username'))
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
