export class Movimiento {

  id?: number;
  cierre_id: number;
  descripcion: String;
  fecha: number;
  iglesia_id: number;
  ultimo_usuario: String;

  constructor(descripcion: string,fecha: number, cierre_id: number, iglesia_id: number, ultimo_usuario: string){
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.cierre_id = cierre_id;
    this.iglesia_id =  iglesia_id;
    this.ultimo_usuario = ultimo_usuario;
  }
}
