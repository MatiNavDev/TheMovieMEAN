import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ToastService } from './toast.service';


@Injectable({
    providedIn: 'root'
  })
export class ErrorHandlerService {

    constructor(
        private toastSrvc: ToastService
    ) { }

    /**
     * Maneja un error estandar
     * @param error 
     * @param observer 
     */
    public handleUniversalError(error: HttpErrorResponse, observer: Subscriber<any>) {
        if (typeof error.error === 'string') {
            console.log(error.error);
            observer.error(error.error);
            observer.complete();
        } else {
            if (error.error) {
                console.log(error.error.errors);
                observer.error(error.error.errors);
                observer.complete();
            } else {
                console.log(error);
                observer.error('Parece que algo anduvo mal');
                observer.complete();
            }
        }
    }


    /**
     * Muestra los errores de un request, al usuario.
     * @param errors 
     */
    public showErrorsToUser(errors) {
        if (Array.isArray(errors)) {
            errors.forEach(e => {
                if (typeof e === 'object') {
                    this.toastSrvc.show(e.description, e.title, 'error');
                }
            });
        } else if (typeof errors === 'string') {
            this.toastSrvc.show(errors, 'Ups !', 'error');
        }
    }
}
