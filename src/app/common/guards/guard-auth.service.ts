import { Injectable } from '@angular/core';
import {
    CanActivate, Router

} from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    private url: string

    constructor(private sessionSrvc: SessionService, private router: Router, ) { }

    private isLoginOrRegisterPage(state): boolean {
        if (state.url.includes('auth')) {
            return true
        }
        return false
    }

    private handleUserAuthenticated(state): boolean {
        if (this.isLoginOrRegisterPage(state)) {
            this.router.navigate(['/rental'])
            return false
        }

        return true
    }

    private handleUserNotAuthenticated(state): boolean {
        if (!this.isLoginOrRegisterPage(state)) {
            this.router.navigate(['/auth'])
            return false
        }

        return true
    }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        return true; // TODO: borrar cuando ande bien

        /*if (this.sessionSrvc.isAuthenticated()) {
            return this.handleUserAuthenticated(state)
        }

        return this.handleUserNotAuthenticated(state)*/
    }

}