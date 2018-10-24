import { Injectable } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isOn: boolean

  constructor(
    private spinner:Ng4LoadingSpinnerService
  ) {
    this.isOn = false;
   }


   /**
    * Muestra el loading
    */
   public show(){
    if(!this.isOn){
      this.isOn = true;
      this.spinner.show();
    }
   }


   /**
    * Esconde el loading
    */
   public hide(){
     if(this.isOn){
       this.isOn = false;
       this.spinner.hide();
     }
   }
}
