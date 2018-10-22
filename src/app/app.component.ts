import { Component, OnInit } from '@angular/core';
import { SessionService } from './common/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private sessionSrvc:SessionService
    ){}

    ngOnInit(){
      this.sessionSrvc.isAuthenticated();
    }
  
}
