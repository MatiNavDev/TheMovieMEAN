import { Component, OnInit } from '@angular/core';
import { SessionService } from './common/services/session.service';
import { SwService } from './common/services/sw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private sessionSrvc: SessionService, private swSrvc: SwService) {
    this.swSrvc.setServiceWorker();
  }

  ngOnInit() {
    this.sessionSrvc.isAuthenticated();
  }
}
