export class JwtDTO {

  token: string;
  type: string;
  usuario: string;
  authorities: string[];

  constructor(token: string,type: string,usuario: string, authorities: string[]){
    this.token = token;
    this.type = type;
    this.usuario = usuario;
    this.authorities = authorities;
  }

}
