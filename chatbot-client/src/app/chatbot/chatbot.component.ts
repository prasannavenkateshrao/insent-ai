import { Component, OnInit } from '@angular/core';
import { ChatBotAPIService,ChatBotResponse,InitialBotResponse,SuccessResponse } from '../config/api.service';
import { webSocket } from "rxjs/webSocket";
@Component({
  selector: 'chat-bot',
  templateUrl: 'chatbot.component.html',
  styleUrls: ['chatbot.component.css']
})
export class ChatBotComponent implements OnInit{
    response:any;
    chatBotResponse: ChatBotResponse | undefined;
    conversationKey:string='';
    conversationValue:string='';
    conversationType:string='';
    timeSpent:number=0;
    valueEntered:boolean=false;
    subscriptionChannel:string='';
    botName:string=''
    userId:string='';
    channelId:string='';
    subject = webSocket('wss://ws-mt1.pusher.com/app/67bb469433cb732caa7a?protocol=7&client=js&version=6.0.3&flash=false');
    firstTimeStamp:any=null;
    constructor(private chatBotAPIService: ChatBotAPIService){  
    }
    ngOnInit() {
        this.chatBotAPIService.getChatBot()
        .subscribe((data:ChatBotResponse) => {
            this.response = data;
            $('#botImage').show();
            this.subscriptionChannel = data.subscriptionChannel;
            this.userId = data.userId;
            this.channelId = data.channelId;
            this.botName = data.botName;
        });
    }
    title = 'chatbot-client';
    showlauncher:boolean = true;
    showcard:boolean = false;

    displayLauncher() {
        this.showlauncher = true;
        this.showcard = false;
    }

    displayCard() {
        this.showlauncher = false;
        this.showcard = true;
        this.subject.subscribe(
            msg => {
                var stringMsg = JSON.parse(JSON.stringify(msg));
                var dataObj = stringMsg['data'];
                var bodyObj = dataObj 
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
                var body = JSON.parse(bodyObj);
                var socket_id=body['socket_id'];
                this.firstTimeStamp=Math.floor(Date.now()/1000);
                this.chatBotAPIService.getInitialData(socket_id)
                    .subscribe((data:InitialBotResponse) => {
                        console.log(data.conversationValue);
                        if(data.conversationType == 'input'){
                            $('#inputDiv').show();
                            $('#insent-input-message-input-box-body-label').html(data.conversationValue);
                            $('#textLabel').html('Enter your '+data.conversationValue);
                            this.conversationKey = data.conversationKey;
                            this.conversationValue = data.conversationValue;
                            this.conversationType = data.conversationType;
                            
                        this.subject.subscribe();
                            this.subject.next({
                                event: "pusher:subscribe",
                                data: {
                                auth: data.visitorAuthResponse,
                                channel: this.subscriptionChannel,
                                channel_data:"{\"user_id\":\"dR2tYfDLJkA4wosm21637317965752\",\"user_info\":{\"userType\":\"visitor\"}}"
                                }
                            });
                        }
                    });                                                                     
            }, 
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
          );
    }
    closeMessageTray(){
        $('#popup-message-detail').hide();
    }
    clearOtherData(){
        $('#textLabel').html("");
        this.valueEntered = true;
    }
    dataEntered(){
        this.chatBotAPIService.updateDeliverStatus()
        .subscribe((data:SuccessResponse) => {
            if(data.updateStatus == 'success'){
                var timestamp=Math.floor(Date.now()/1000); 
                var eventType = 'USER_DATA_PROVIDED';
                var field = this.conversationKey;
                this.timeSpent++;
                this.chatBotAPIService.updateSpentTime(eventType,timestamp,field,this.timeSpent)
                .subscribe((data:SuccessResponse) => {
                    if(data.updateStatus != 'success'){
                        console.error("updateTime API call failed");
                    }
                    this.subject.subscribe();
                    this.subject.next({
                        event: "client-widget-message",
                        data: {
                          senderId: this.userId,
                          channelName: this.channelId,
                          message: {
                            firstName: $('fieldName').val(),
                            lastMessageTimeStamp: this.firstTimeStamp
                          },
                          display: {
                            img: "https://staging-uploads.insent.ai/insentrecruit/logo-insentrecruit-1636924693820?1636924693897",
                            name: this.botName,
                            lastMessageTimeStamp: this.firstTimeStamp,
                            lead: false,
                            time: timestamp,
                            type: this.conversationType,
                            userId: "bot",
                            input: {
                              key: this.conversationKey,
                              type: "plain",
                              text: this.conversationValue,
                              value: $('#fieldName').val(),
                              disabled: true
                            },
                            channelId: this.channelId
                          }
                        },
                        channel: this.subscriptionChannel
                      });
                      this.subject.complete(); // Closes the connection.
                      this.subject.error({code: 4000, reason: 'Subscription to websocket got disconnected!'});
                });
            }
        });
    }
}