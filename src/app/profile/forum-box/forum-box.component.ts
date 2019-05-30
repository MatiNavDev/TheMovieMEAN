import { PaginatorService } from './../../common/services/paginator.service';
import { LoadingService } from './../../common/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'forum-box',
  templateUrl: './forum-box.component.html',
  styleUrls: ['./forum-box.component.scss']
})
export class ForumBoxComponent implements OnInit {
  @Input('params') params;
  private urlFromitems = environment.url + 'posts';
  private items: any = {};
  private lastPage: number;
  public actualPage: number = 0;
  public ghosts = [];
  public itemsToShow = [];
  public paginatorParams: any;

  constructor(private loadingSrvc: LoadingService, private paginatorSrvc: PaginatorService) {}

  ngOnInit() {
    this.onChangeItemPage(1);
  }

  /**
   * Maneja llamar al paginator cada vez que hay un cambio de pagina, el cual maneja la logica de la misma
   * @param pageNumber
   */
  public onChangeItemPage(pageNumber) {
    this.ghosts = new Array(environment.pageSize);
    this.itemsToShow = [];
    this.paginatorSrvc
      .handlePageChanged(this.items, pageNumber, this.urlFromitems)
      .subscribe(data => {
        this.ghosts = [];
        this.loadingSrvc.hide();
        const paginatorResponse = data.result;
        this.items = paginatorResponse.items;
        if (paginatorResponse.lastPage) this.lastPage = paginatorResponse.lastPage;
        this.actualPage = pageNumber;
        this.itemsToShow = this.items[this.actualPage] || [];
        this.paginatorParams = {
          actualPage: this.actualPage,
          elements: this.items,
          lastPage: this.lastPage
        };
      });
  }

  /**
   *
   * @param type
   */
  public onSetForumGridType(type: string) {
    switch (type) {
      case 'p':
        this.urlFromitems = environment.url + 'posts';

        break;

      default:
        break;
    }
  }

  public onGoToItemDetail(item) {}
}
