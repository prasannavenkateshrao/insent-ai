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
    timeSpent:number=0;
    valueEntered:boolean=false;
    eventTypeArray=['DEBUG_PAGE_BLUR','WIDGET_SHOWN','GREETING_MESSAGE_SHOWN'];
    subscriptionChannel:string='';
    userId:string='';
    channelId:string='';
    subject = webSocket('wss://ws-mt1.pusher.com/app/67bb469433cb732caa7a?protocol=7&client=js&version=6.0.3&flash=false');
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
        });
    }
    title = 'chatbot-client';
    showlauncher:boolean = true;
    showcard:boolean = false;

    displayLauncher() {
        console.log('coming inseide');
        this.showlauncher = true;
        this.showcard = false;
    }

    displayCard() {
        this.showlauncher = false;
        this.showcard = true;
        this.subject.subscribe(
            msg => {
                console.log('message received: ' + JSON.stringify(msg)); // Called whenever there is a message from the server.
                var b = JSON.parse(JSON.stringify(msg));
                var a = b['data'];
                var final = a 
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
                console.log(final);
                var body = JSON.parse(final);
                var socket_id=body['socket_id'];
                console.log('id->'+socket_id);
                this.chatBotAPIService.getInitialData(socket_id)
                    .subscribe((data:InitialBotResponse) => {
                        console.log(data.conversationValue);
                        if(data.conversationType == 'input'){
                            $('#inputDiv').show();
                            $('#insent-input-message-input-box-body-label').html(data.conversationValue);
                            $('#textLabel').html('Enter your '+data.conversationValue);
                            this.conversationKey = data.conversationKey;
                            
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
                          senderId: "dR2tYfDLJkA4wosm21637317965752",
                          channelName: "private-dR2tYfDLJkA4wosm216373179657521637327997415",
                          message: {
                            firstName: "prasanna",
                            lastMessageTimeStamp: 1637791107635
                          },
                          display: {
                            img: "https://staging-uploads.insent.ai/insentrecruit/logo-insentrecruit-1636924693820?1636924693897",
                            name: "InsentBot",
                            lastMessageTimeStamp: 1637791107635,
                            lead: false,
                            time: timestamp,
                            type: "input",
                            userId: "bot",
                            input: {
                              key: "firstName",
                              type: "plain",
                              text: "First Name",
                              value: "prasanna",
                              disabled: true
                            },
                            channelId: "private-dR2tYfDLJkA4wosm216373179657521637327997415"
                          }
                        },
                        channel: "presence-insentrecruit-widget-user-dR2tYfDLJkA4wosm21637317965752"
                      });
                      this.subject.subscribe();
                      this.subject.complete(); // Closes the connection.

                      this.subject.error({code: 4000, reason: 'I think our app just broke!'});
                });
            }
        });
    }
}