export class MovimientoDetalle {
  id?: number;
  comentario: String;
  estado: String;
  miembro_id: number;
  monto: number;
  movimiento_id: number;
  tipo_registro_id: number;
  ultimo_usuario: String;

  constructor(movimiento_id: number, tipo_registro_id: number, comentario: string, monto: number,
    miembro_id: number, estado: string, ultimo_usuario: string){
      this.comentario = comentario;
      this.estado = estado;
      this.miembro_id = miembro_id;
      this.monto = monto;
      this.movimiento_id = movimiento_id;
      this.tipo_registro_id = tipo_registro_id;
      this.ultimo_usuario = ultimo_usuario;
    }
}
