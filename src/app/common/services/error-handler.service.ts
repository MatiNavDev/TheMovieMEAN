import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscriber } from 'rxjs/internal/Subscriber';


@Injectable()
export class ErrorHandlerService{

    /**
     * Maneja un error estandar
     * @param error 
     * @param observer 
     */
    public handleUniversalError(error: HttpErrorResponse,observer: Subscriber<any>){
        console.log(error.error.errors);
        observer.error(error.error.errors);
        observer.complete();
    }

}