import { Injectable, OnInit } from "@angular/core";


@Injectable()
export class StorageService {
    private storage: Storage

    constructor(){
        this.storage = window.localStorage
    }

    /**
     * Transforma el objeto obtenido en un string y lo guarda en el storage bajo la clave pasada.
     * @param key 
     * @param data 
     */
    public saveToStorage(key: string, data: any){
        if(typeof data !== "string"){
            data = JSON.stringify(data);
        }
        this.storage.setItem(key, data);
    }


    /**
     * Obtiene el objeto desde el storage y lo parsea para devolverlo como fue seteado
     * @param key 
     */
    public getFromStorage(key: string): any{
        return JSON.parse(this.storage.getItem(key));
    }


    public removeFromStorage(key: string){
        return this.storage.removeItem(key);
    }
}