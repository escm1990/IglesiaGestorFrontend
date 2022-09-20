export class EventoDetalle {
  id? : number;
  id_evento: number;
  miembro_id: number;
  comentario: String;
  ultimo_usuario: string;

  constructor(id_evento: number, miembro_id: number, comentario: string, ultimo_usuario: string){
    this.comentario = comentario;
    this.id_evento = id_evento;
    this.miembro_id = miembro_id;
    this.ultimo_usuario = ultimo_usuario;
  }
}
