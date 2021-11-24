import { Component, OnInit } from '@angular/core';
import { ChatBotAPIService,ChatBotResponse,InitialBotResponse,SuccessResponse } from '../config/api.service';
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
    constructor(private chatBotAPIService: ChatBotAPIService){  
    }
    ngOnInit() {
        this.chatBotAPIService.getChatBot()
        .subscribe((data:ChatBotResponse) => {
            this.response = data;
            $('#botImage').show();
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
        this.chatBotAPIService.getInitialData()
        .subscribe((data:InitialBotResponse) => {
            console.log(data.conversationValue);
            if(data.conversationType == 'input'){
                $('#inputDiv').show();
                $('#insent-input-message-input-box-body-label').html(data.conversationValue);
                $('#textLabel').html('Enter your '+data.conversationValue);
                this.conversationKey = data.conversationKey;
            }
        });
    }
    closeMessageTray(){
        $('#popup-message-detail').hide();
    }
    openBotMessages(){
        this.chatBotAPIService.getInitialData()
        .subscribe((data:InitialBotResponse) => {
            console.log(data.conversationValue);
            if(data.conversationType == 'input'){
                $('#headContent').hide();
                $('#insent-input-message-input-box').show();
                $('#insent-input-message-input-box-body-label').html(data.conversationValue);
                $('#textLabel').html('Enter your '+data.conversationValue);
                this.conversationKey = data.conversationKey;
            }
        });
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
                });
            }
        });
    }
}