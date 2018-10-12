import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public sessionSrvc:SessionService) { }

  ngOnInit() {
  }

}
