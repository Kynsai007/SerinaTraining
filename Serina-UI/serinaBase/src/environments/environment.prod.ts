// import { IMqttServiceOptions } from "ngx-mqtt";
let apiUrlString = "";
let client_id = '2942db6f-2115-4b6a-a5a0-12e46d19c0f1'
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
if(location.href.toLowerCase().includes('agi')){
  client_id = "5ef48563-f560-4413-9775-fc6bc5b79b76";
}
export const environment = {
  production: true,
  apiUrl: `https://${apiUrlString}.centralindia.cloudapp.azure.com`,
  apiVersion: "apiv1.1",
  userData: JSON.parse(localStorage.getItem('currentLoginUser')),
  userName: JSON.parse(localStorage.getItem('username'))
};

export const environment1  = {
  hostname: `${apiUrlString}.centralindia.cloudapp.azure.com/apiv1.1`,
  sso_client_id: client_id,
  // hostname: `${location.href.split("https://")[1].split(".serinaplus.com")[0]}.centralindia.cloudapp.azure.com`,
  // port: 443,
  // protocol: 'wss',
  // path: '/console',
  // clientId: Math.floor(Math.random() * 100000).toString(),
  // keepalive:10,
  username: environment.userName ? environment.userName :'',
  password: environment.userData ? environment.userData.token : '',

 }
