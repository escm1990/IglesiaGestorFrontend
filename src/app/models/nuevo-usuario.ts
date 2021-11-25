export class NuevoUsuario {

  usuario: String;
  password: string;
  correo: string;
  estado: string;
  //authorities: string[];

  constructor(usuario: string, password: string, correo: string, estado : string){//, authorities: string[]){
    this.usuario = usuario;
    this.password = password;
    this.correo = correo;
    this.estado = estado;
  }


}
