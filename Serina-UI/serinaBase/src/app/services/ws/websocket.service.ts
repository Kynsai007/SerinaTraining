import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment1 } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  userId: any;
  service_account: any;
  authToken: string;
  private messageSubject: Subject<any> = new Subject<any>();
  file: Uint8Array;

  constructor() {

  }

  connectWebsocket(){
    this.socket = new WebSocket(`ws://${environment1.hostname}/Invoice/ServiceInvoiceUpload/${this.userId}/AccountNumber/${this.service_account}`);
    // Replace 'wss://your-websocket-server-url' with the actual WebSocket server URL

    this.socket.onopen = () => {
      this.sendCustomHeaders();
    };

    this.socket.onmessage = (event) => {
      console.log(event)
      this.messageSubject.next(event.data); // Just forward the raw data without JSON parsing
    };
  }

  private sendCustomHeaders() {
    const customHeaders = {
      'Content-Type': 'application/json',
      Authorization: `${this.authToken}`,
    };
    this.socket.send(JSON.stringify(customHeaders));
  }

  public getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  sendFile(fileContent) {
      let body = {
        file: fileContent
      }
      this.socket.send(fileContent);
  }

  close() {
    this.socket.close();
  }
  

}
