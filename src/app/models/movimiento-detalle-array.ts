import { MovimientoDetalle } from './movimiento-detalle';
export class MovimientoDetalleArray {

  detalles: MovimientoDetalle[] = [];

  constructor(detalles: MovimientoDetalle[]){
    this.detalles = detalles;
  }
}
