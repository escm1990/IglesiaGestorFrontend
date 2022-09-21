export class EventoDetalle {
  id? : number;
  evento_id: number;
  miembro_id: number;
  comentario: String;
  ultimo_usuario: string;

  constructor(id_evento: number, miembro_id: number, comentario: string, ultimo_usuario: string){
    this.comentario = comentario;
    this.evento_id = id_evento;
    this.miembro_id = miembro_id;
    this.ultimo_usuario = ultimo_usuario;
  }
}
