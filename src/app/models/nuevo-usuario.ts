export class NuevoUsuario {

  usuario: String;
  password: string;
  correo: string;
  estado: string;
  id_iglesia: number;
  //authorities: string[];

  constructor(usuario: string, password: string, correo: string, estado : string, iglesia: number){//, authorities: string[]){
    this.usuario = usuario;
    this.password = password;
    this.correo = correo;
    this.estado = estado;
    this.id_iglesia =  iglesia;
  }


}
