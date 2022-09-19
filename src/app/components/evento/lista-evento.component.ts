import { EventoService } from './../../service/evento.service';
import { TokenService } from './../../service/token.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Evento } from './../../models/evento';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lista-evento',
  templateUrl: './lista-evento.component.html',
  styleUrls: ['./lista-evento.component.scss']
})
export class ListaEventoComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  Eventos: Evento[] = [];
  roles: string[];
  isAdmin =  false;
  iglesiaTemp: string;
  iglesia_id: number;

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol =>{
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarEventos(){
    if(this.isAdmin){
      this.eventoService.listar().subscribe(
        {
          next: (data) => {
            this.Eventos = data;
            this.dtTrigger.next(data);
          },
          error: (e) => {
            this.toastr.error(e, 'Error (listarPorIglesia)', {
              timeOut: 3000, positionClass: 'toast-top-center',
            });
          },
          complete: () => console.info('Consulta de eventos finalizada')
        }
      )
    } else {
      this.iglesiaTemp = this.tokenService.getUserIglesiaId();
      this.iglesia_id = +this.iglesiaTemp;
      this.eventoService.listarIglesia(this.iglesia_id).subscribe(
        {
          next: (data) => {
            this.Eventos = data;
            this.dtTrigger.next(data);
          },
          error: (e) => {
            this.toastr.error(e, 'Error (listarPorIglesia)', {
              timeOut: 3000, positionClass: 'toast-top-center',
            });
          },
          complete: () => console.info('Consulta de eventos finalizada')
        }
      )
    }
  }

  borrar(id: number | any){
    this.eventoService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Evento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarEventos();
      }
    })

  }

}
