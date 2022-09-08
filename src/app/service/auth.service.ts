import { JwtDTO } from './../models/jwt-dto';
import { LoginUsuario } from './../models/login-usuario';
import { NuevoUsuario } from './../models/nuevo-usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = 'http://localhost:9090/auth/';

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authUrl+'nuevo',nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO>{
    return this.httpClient.post<JwtDTO>(this.authUrl+'login',loginUsuario);
  }

  public user(user: String): Observable<Usuarios>{
    return this.httpClient.get<Usuarios>(this.authUrl+ `user/${user}`);
  }

}
