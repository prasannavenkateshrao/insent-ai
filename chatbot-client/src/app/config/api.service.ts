import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface ChatBotResponse {
    channelId: string;
    sessionId: string;
    userId: string;
    popupMessage: string;
    botName: string;
    botCompanyName: string;
    initiateSocketConnection: boolean;
    subscriptionChannel: string;
    displayWidget: boolean;
    widgetImage: string;
  }
  export interface InitialBotResponse {
    isLastConversation: boolean;
    conversationType: string;
    conversationKey: string;
    conversationValue: string;
    visitorAuthResponse: string;
  }
  export interface SuccessResponse {
    updateStatus: string;
  }
@Injectable()
export class ChatBotAPIService {
  constructor(private http: HttpClient) { }
  getChatBot() {
    return this.http.get<ChatBotResponse>('http://localhost:8000/get/chat-bot');
  }
  getInitialData(socket_id:string){ 
      return this.http.get<InitialBotResponse>('http://localhost:8000/retrieve/chat-bot/data?socketId='+socket_id);
  }
  updateDeliverStatus(){
      return this.http.get<SuccessResponse>('http://localhost:8000/update/user/conversation?operation=deliver');
  }
  updateSpentTime(eventType:string,timestamp:number,field:string,timeSpent:number){
    return this.http.get<SuccessResponse>('http://localhost:8000/update/user/conversation?operation=spentTime&eventType='+eventType+
    '&timestamp='+timestamp+'&field='+field+'&timeSpent='+timeSpent);
    
  }
}