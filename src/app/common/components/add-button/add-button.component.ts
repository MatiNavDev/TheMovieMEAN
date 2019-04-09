import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Input('params') params: any;
  @Output() onAddButtonClick = new EventEmitter();

  constructor() {}
}
