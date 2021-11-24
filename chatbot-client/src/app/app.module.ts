import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatBotAPIService } from './config/api.service'; 
import {ChatBotComponent} from './chatbot/chatbot.component';
import * as $ from 'jquery';
@NgModule({
  declarations: [
    AppComponent,
    ChatBotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ChatBotAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
