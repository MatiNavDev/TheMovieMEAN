import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  /**
   * Envia al usuario a un link externo
   */
  goToExternalLink(link) {
    window.location.href = link;
  }
}
