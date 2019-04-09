import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  constructor(private reqSrvc: RequestService) {}

  /**
   * Maneja el haber cambiado de pagina del paginador
   * @param pagesData
   * @param pageChanged
   */
  public async handlePageChanged(elements: any, pageNumber: number, url: String) {
    let pagesRange = [];

    let elementsResponse = elements;

    for (let index = 0; index < environment.paginatorSize; index++) {
      pagesRange.push(index + 1);
    } // pagesRange = [1, 2, 3, 4, 5]

    if (!Object.keys(elements).includes(String(pageNumber))) {
      const multiplicator = Math.floor(pageNumber / environment.paginatorSize);
      pagesRange = pagesRange.map(pr => environment.paginatorSize * multiplicator + pr);

      //TODO: cuando ande el hardcodeado probar que ande este
      // elementsResponse = await this.reqSrvc.getLikePromise(
      //   environment.url + `${url}?page=(${pagesRange[0]},${pagesRange[pagesRange.length - 1]})`
      // );
    }

    // return elementsResponse;
    return {
      lastPage: 2,
      posts: {
        1: [
          {
            id: 1,
            title: 'titulo hardcodeado',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 1, name: 'autor hardcodeado 1' },
            lastMsgAutor: { id: 1, name: 'lastMsgAutor hardcodeado 1' },
            responses: 1
          },
          {
            id: 2,
            title: 'titulo hardcodeado 2',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 2, name: 'autor hardcodeado 2' },
            lastMsgAutor: { id: 4, name: 'lastMsgAutor hardcodeado 2' },
            responses: 2
          },
          {
            id: 3,
            title: 'titulo hardcodeado 3',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 3, name: 'autor hardcodeado 3' },
            lastMsgAutor: { id: 3, name: 'lastMsgAutor hardcodeado 3' },
            responses: 3
          },
          {
            id: 4,
            title: 'titulo hardcodeado 4',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 4, name: 'autor hardcodeado 4' },
            lastMsgAutor: { id: 4, name: 'lastMsgAutor hardcodeado 4' },
            responses: 4
          }
        ],
        2: [
          {
            id: 1,
            title: 'titulo hardcodeado 2',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 1, name: 'autor hardcodeado 1' },
            lastMsgAutor: { id: 1, name: 'lastMsgAutor hardcodeado 1' },
            responses: 1
          },
          {
            id: 2,
            title: 'titulo hardcodeado 2-2',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 2, name: 'autor hardcodeado 2' },
            lastMsgAutor: { id: 4, name: 'lastMsgAutor hardcodeado 2' },
            responses: 2
          },
          {
            id: 3,
            title: 'titulo hardcodeado 3-3',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 3, name: 'autor hardcodeado 3' },
            lastMsgAutor: { id: 3, name: 'lastMsgAutor hardcodeado 3' },
            responses: 3
          },
          {
            id: 4,
            title: 'titulo hardcodeado 4-4',
            img: '../../../../assets/icons/icon-152x152.png',
            autor: { id: 4, name: 'autor hardcodeado 4' },
            lastMsgAutor: { id: 4, name: 'lastMsgAutor hardcodeado 4' },
            responses: 4
          }
        ]
      }
    };
  }
}
