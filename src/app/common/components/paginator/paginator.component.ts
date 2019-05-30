import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {
  @Input('params') params;
  @Output() onChangePage = new EventEmitter();
  public var = [1];
  public pages: string[];

  constructor() {}

  ngOnChanges() {
    if (this.params) {
      this.pages = Object.keys(this.params.elements);
    }

    console.log(this.params);
  }

  /**
   * Devuelve si mostrar o no las proximas paginas
   * @param string
   */
  public showNextPages() {
    return this.params.actualPage != this.params.lastPage;
  }
}
