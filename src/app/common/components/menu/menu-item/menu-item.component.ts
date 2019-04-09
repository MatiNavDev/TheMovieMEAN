import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input('title') title: String;
  @Output() onAction = new EventEmitter();
  @Input('route') route: String;

  constructor(private sessionSrvc: SessionService) {}
}
