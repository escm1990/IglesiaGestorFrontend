import { Miembro } from 'src/app/models/miembro';
import { EventoDetalle } from './../../models/evento-detalle';
import { EventoDetalleService } from './../../service/evento-detalle.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MiembroService } from './../../service/miembro.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-evento-detalle',
  templateUrl: './detalle-evento-detalle.component.html',
  styleUrls: ['./detalle-evento-detalle.component.scss']
})
export class DetalleEventoDetalleComponent implements OnInit {

  eventoDetalle: EventoDetalle;
  miembro: Miembro;
  miembroMostrar = '';

  constructor(
    private miembroService: MiembroService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private eventoDetalleService: EventoDetalleService
  ) { }

  ngOnInit(): void {
    this.mostrarDetalle();
  }

  mostrarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;

    this.eventoDetalleService.detalle(id).subscribe(
      {
        next: (data) =>{
          this.eventoDetalle = data;

          this.miembroService.detalle(this.eventoDetalle.miembro_id).subscribe(
            {
              next: (data) =>{
                this.miembro = data;
                this.miembroMostrar = this.miembro.nombre+' '+this.miembro.apellido;
              },
              error: (err) => {
                this.toastr.error(err.error.mensaje, 'Error (DetalleMiembro)', {
                  timeOut: 3000,  positionClass: 'toast-top-center',
                });
              }
            }
          );
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (DetalleEvento)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/detalle/'+this.eventoDetalle.evento_id]);
  }

}
