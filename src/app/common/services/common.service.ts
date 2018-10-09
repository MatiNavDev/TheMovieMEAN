import { Injectable } from '@angular/core';



@Injectable()
export class CommonService {

    /**
     * Envia al usuario a un link externo
     */
    goToExternalLink(link){
        window.location.href = link
    }
        
}
