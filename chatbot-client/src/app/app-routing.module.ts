import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatBotComponent} from './chatbot/chatbot.component';
import {PageNotFoundComponent} from './pagenotfound/pagenotfound.component'
const routes: Routes = [
  { path: 'chat-bot', component: ChatBotComponent },
  { path: '',   redirectTo: '/chat-bot', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
