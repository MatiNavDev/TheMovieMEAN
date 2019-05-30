import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Envia al usuario a un link externo
   */
  goToExternalLink(link) {
    window.location.href = link;
  }
}
