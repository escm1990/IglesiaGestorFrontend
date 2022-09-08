export class Usuarios {

  id? :  number;
  correo: String;
  estado: String;
  fecha: number;
  iglesia_id: number;
  password: String;
  usuario: String;

  constructor(usuario: string, password: string, correo: string, estado: string, fecha: number, iglesia_id: number){
    this.correo = correo;
    this.estado = estado;
    this.fecha = fecha;
    this.iglesia_id = iglesia_id;
    this.usuario = usuario;
    this.password =  password;
  }

}
