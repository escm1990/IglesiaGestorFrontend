import { ToastrService } from 'ngx-toastr';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lista-tipo-evento',
  templateUrl: './lista-tipo-evento.component.html',
  styleUrls: ['./lista-tipo-evento.component.scss']
})
export class ListaTipoEventoComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  TiposEventos: TipoEvento[] = [];

  constructor(
    private tipoEventoService: TipoEventoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTiposEvento();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarTiposEvento(): void{

    this.tipoEventoService.listar().subscribe({
      next: (data) => {
        this.TiposEventos = data;
        this.dtTrigger.next(data);
      },
      error: (e) => {
        this.toastr.error(e, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => console.info('Consulta de tipos de eventos finalizada')
    })

  }

  borrar(id: number | any){
    this.tipoEventoService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Tipo de Evento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarTiposEvento();
      }
    })
  }
}
