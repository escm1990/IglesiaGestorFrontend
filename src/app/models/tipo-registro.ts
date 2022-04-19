export class TipoRegistro {

  id? :  number;
  descripcion: String;
  estado: String;
  tipoContabilizacion: String;
  ultimoUsuario: String;

  constructor(descripcion: string, estado: string, tipoContabilizacion: string, ultimoUsuario: string){
    this.descripcion =  descripcion;
    this.estado = estado;
    this.tipoContabilizacion = tipoContabilizacion;
    this.ultimoUsuario = ultimoUsuario;
  }

}
