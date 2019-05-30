import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  constructor(private errorSrvc: ErrorHandlerService, private http: HttpClient) {}

  /**
   * Maneja el haber cambiado de pagina del paginador
   * @param pagesData
   * @param pageChanged
   */
  public handlePageChanged(
    elements: any,
    pageNumber: number,
    url: String,
    sortField?: any
  ): Observable<any> {
    let pagesRange = [];
    let elementsResponse = elements;

    for (let index = 0; index < environment.paginatorSize; index++) {
      pagesRange.push(index + 1);
    } // pagesRange = [1, 2, 3, 4, 5]

    //si los elementos incluyen la pagina, no hay que hacer un get al server porque ya se tiene
    // sino si hay que hacerlo
    if (!Object.keys(elements).includes(String(pageNumber))) {
      const multiplicator = Math.floor(pageNumber / environment.paginatorSize);
      pagesRange = pagesRange.map(pr => environment.paginatorSize * multiplicator + pr);
      let getItemsUrl = `${url}?pagesRange=${JSON.stringify(pagesRange)}&amountPerPage=${
        environment.pageSize
      }`;
      if (sortField) getItemsUrl + `&sortField=${sortField}`;

      return this.http.get(getItemsUrl).pipe(
        catchError(error => {
          throw this.errorSrvc.handleRequestError(error);
        })
      );
    } else {
      return of({ result: { items: elementsResponse } });
    }
  }
}
