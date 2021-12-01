export class TipoEvento {
  id? :  number;
  descripcion: String;
  estado: String;
  iglesia_id: number;

  constructor(descripcion: string, estado: string, iglesia_id: number){
    this.descripcion =  descripcion;
    this.estado = estado;
    this.iglesia_id = iglesia_id;
  }

}
