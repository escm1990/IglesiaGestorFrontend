import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './../service/token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovimientoGuardService {

  realRol: String;

  constructor(private tokenService: TokenService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean{
    const expectedRol = route.data.expectedRol;
    const roles = this.tokenService.getAuthorities();
    this.realRol = 'user';
    roles.forEach(rol => {
      if(rol === 'ROLE_ADMIN'){
        this.realRol = 'admin';
      }
    });
    if(!this.tokenService.getToken() || expectedRol.indexOf(this.realRol) === -1){
      this.router.navigate(['/dashboard/home']);
      return false;
    }
    return true;
  }
}
