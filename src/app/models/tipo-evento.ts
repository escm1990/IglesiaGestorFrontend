export class TipoEvento {
  id? :  number;
  descripcion: String;
  estado: String;
  ultimoUsuario: String;

  constructor(descripcion: string, estado: string, ultimoUsuario: string){
    this.descripcion =  descripcion;
    this.estado = estado;
    this.ultimoUsuario = ultimoUsuario;
  }

}
