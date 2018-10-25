import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Injectable({
    providedIn: 'root'
  })
export class ToastService {


    constructor(public toasterService: ToasterService) {
    }


    /**
      * Muestra el toast con la configuracion recibida
      * @param string
      * @author MN 2018-06-17
      */
    public show(msg, title, type, closeButtonReceived?) {
        var closeButton = closeButtonReceived || false;


        var toast = {
            type: type,
            title: title,
            body: msg,
            showCloseButton: closeButton,
            tapToDissmiss: false
        };

        this.toasterService.pop(toast);
    }
}
