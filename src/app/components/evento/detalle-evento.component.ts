import { TokenService } from './../../service/token.service';
import { EventoDetalle } from './../../models/evento-detalle';
import { EventoDetalleService } from './../../service/evento-detalle.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { EventoService } from './../../service/evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { Evento } from './../../models/evento';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.scss']
})
export class DetalleEventoComponent implements OnInit, OnDestroy {

  evento: Evento;
  tipoEvento: TipoEvento;
  descripcion: String;
  fechaMostrar: string = '';
  tipoEventoMostrar: String = '';
  eventoDetalle: EventoDetalle[] = [];
  miembroMostrar = '';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isAdmin =  false;
  roles: string[];

  constructor(
    private eventoService: EventoService,
    private eventoDetalleService: EventoDetalleService,
    private tipoEventoService: TipoEventoService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol =>{
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
    this.mostrarDetalle();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  mostrarDetalle(){
    const id = this.activateRoute.snapshot.params.id;

    this.eventoService.detalle(id).subscribe(
      {
        next: (data) =>{
          this.evento = data;

          this.tipoEventoService.detalle(this.evento.tipo_evento_id).subscribe(
            {
              next: (data) =>{
                this.tipoEvento = data;
                this.tipoEventoMostrar = this.tipoEvento.descripcion;
              },
              error: (err) =>{
                this.toastr.error(err.error.mensaje, 'Error (DetalleTipoPersona1)', {
                  timeOut: 3000,  positionClass: 'toast-top-center',
                });
              }
            }
          );

          this.fechaMostrar = this.milisegundosFecha(this.evento.fecha);
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/listar']);
  }

  milisegundosFecha(milisegundos: number) : string{
    var date = new Date(milisegundos);
    var result = date.toLocaleDateString(); // 10/29/2013
    return result;
  }

  cargarDetalleEvento(id: number){
    this.eventoDetalleService.listarEvento(id).subscribe(
      {
        next: (data) => {
          this.eventoDetalle = data;
          this.dtTrigger.next(data);
        },
        error: (e) => {
          this.toastr.error(e, 'Error (listarPorEvento)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de detalle de evento finalizada')
      }
    );
  }

  cargarListaDetalleEvento(){
    this.eventoDetalleService.listar().subscribe({
      next: (data) =>{
        this.eventoDetalle =  data;
      },
      error: (e) => {
        this.toastr.error(e, 'Error (listarEventoDetalle)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => console.info('Consulta de detalle finalizada')
    });
  }

  borrar(id: number | any){
    this.eventoDetalleService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Evento Detalle Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarListaDetalleEvento();
      }
    });
  }
}
