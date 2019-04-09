import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastSrvc: ToastService) {}

  /**
   * Maneja un error estandar
   * @param error
   * @param observer
   */
  public handleUniversalError(error: HttpErrorResponse) {
    let errorToShow;
    if (error.error) {
      console.log(error.error.errors);
      errorToShow = error.error.errors;
    } else {
      console.log(error);
      errorToShow = 'Parece que algo anduvo mal';
    }

    return errorToShow;
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
