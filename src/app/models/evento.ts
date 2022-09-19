export class Evento {

  id?: number;
  descripcion: String;
  fecha: number;
  iglesia_id: number;
  tipo_evento_id: number;
  ultimo_usuario: String;

  constructor(descripcion: string, fecha: number, iglesia_id: number, tipo_evento_id: number, ultimo_usuario: string){
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.iglesia_id = iglesia_id;
    this.tipo_evento_id = tipo_evento_id;
    this.ultimo_usuario = ultimo_usuario;
  }
}
