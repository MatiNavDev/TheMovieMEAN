import { LoadingService } from './loading.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastSrvc: ToastService, private loadingSrvc: LoadingService) {}

  /**
   * Maneja un error estandar
   * @param error
   * @param observer
   */
  private getRequestError(error: HttpErrorResponse) {
    return error.error && error.error.errors
      ? error.error.errors
      : [{ title: 'Parece que algo anduvo mal' }];
  }

  /**
   * Maneja los errores provenientes de un request
   * @param error
   */
  public handleRequestError(error: HttpErrorResponse) {
    this.loadingSrvc.hide();
    this.showErrorsToUser(this.getRequestError(error));
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
