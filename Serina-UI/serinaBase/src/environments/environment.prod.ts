// import { IMqttServiceOptions } from "ngx-mqtt";
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
  production: true,
  // apiUrl: `https://${location.href.split("https://")[1].split(".serinaplus.com")[0]}.centralindia.cloudapp.azure.com`,
  // apiUrl:"https://cenomidev.centralindia.cloudapp.azure.com",
  apiUrl: `https://${apiUrlString}.centralindia.cloudapp.azure.com`,
  // apiUrl:"http://127.0.0.1:8000",
  apiVersion: "apiv1.1",
  userData: JSON.parse(localStorage.getItem('currentLoginUser')),
  userName: JSON.parse(localStorage.getItem('username'))
};

export const environment1  = {
  hostname: `${apiUrlString}.centralindia.cloudapp.azure.com/apiv1.1`,
  // hostname: `${location.href.split("https://")[1].split(".serinaplus.com")[0]}.centralindia.cloudapp.azure.com`,
  // port: 443,
  // protocol: 'wss',
  // path: '/console',
  // clientId: Math.floor(Math.random() * 100000).toString(),
  // keepalive:10,
  username: environment.userName ? environment.userName :'',
  password: environment.userData ? environment.userData.token : ''
 }
