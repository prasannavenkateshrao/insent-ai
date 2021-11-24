import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
  }
}
