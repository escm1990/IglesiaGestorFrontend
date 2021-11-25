import { LoginUsuario } from './../models/login-usuario';
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { TokenService } from './../service/token.service';
import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() isLogged =  false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  usuario: string;
  password: string;
  roles: string[];
  errMsj: String;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }

  }

  //Haciendo el login
  onLogin(): void{
    this.loginUsuario = new LoginUsuario(this.usuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;
        this.isLoginFail = false;

        this.tokenService.setToken(data.token); //el token lo saca del JwtDto que se retorna
        this.tokenService.setUsername(data.usuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.router.navigate(['/']);
      },
      err =>{
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.mensaje;
        console.log(this.errMsj);
      }
    )
  }

}
