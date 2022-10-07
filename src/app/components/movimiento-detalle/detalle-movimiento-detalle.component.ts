import { TipoRegistroService } from './../../service/tipo-registro.service';
import { TipoRegistro } from './../../models/tipo-registro';
import { MovimientoDetalleService } from './../../service/movimiento-detalle.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MiembroService } from './../../service/miembro.service';
import { Miembro } from './../../models/miembro';
import { MovimientoDetalle } from './../../models/movimiento-detalle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-movimiento-detalle',
  templateUrl: './detalle-movimiento-detalle.component.html',
  styleUrls: ['./detalle-movimiento-detalle.component.scss']
})
export class DetalleMovimientoDetalleComponent implements OnInit {

  movimientoDetalle: MovimientoDetalle;
  miembro: Miembro;
  miembroMostrar = '';
  tipoRegistro: TipoRegistro;
  tipoRegistroMostrar = '';

  constructor(
    private miembroService: MiembroService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private movimientoDetalleService: MovimientoDetalleService,
    private tipoRegistroService: TipoRegistroService
  ) { }

  ngOnInit(): void {
    this.mostrarDetalle();
  }

  private mostrarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;

    this.movimientoDetalleService.detalle(id).subscribe(
      {
        next: (data) => {
          this.movimientoDetalle = data;

          this.miembroService.detalle(this.movimientoDetalle.miembro_id).subscribe(
            {
              next: (data) =>{
                this.miembro = data;
                this.miembroMostrar = this.miembro.nombre+' '+this.miembro.apellido;
              },
              error: (err) => {
                this.toastr.error(err.error.mensaje, 'Error (Detalle Movimiento 1)', {
                  timeOut: 3000,  positionClass: 'toast-top-center',
                });
              }
            }
          );

          this.tipoRegistroService.detalle(this.movimientoDetalle.tipo_registro_id).subscribe(
            {
              next: (data) =>{
                this.tipoRegistro = data;
                this.tipoRegistroMostrar = this.tipoRegistro.descripcion.toString();
              },
              error: (err) => {
                this.toastr.error(err.error.mensaje, 'Error (Detalle Movimiento 2)', {
                  timeOut: 3000,  positionClass: 'toast-top-center',
                });
              }
            }
          );
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle Movimiento)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/detalle/'+this.movimientoDetalle.movimiento_id]);
  }
}
