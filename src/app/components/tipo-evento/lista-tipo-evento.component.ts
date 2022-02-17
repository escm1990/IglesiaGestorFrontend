import { ToastrService } from 'ngx-toastr';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-tipo-evento',
  templateUrl: './lista-tipo-evento.component.html',
  styleUrls: ['./lista-tipo-evento.component.scss']
})
export class ListaTipoEventoComponent implements OnInit {

  TiposEventos: TipoEvento[] = [];

  constructor(
    private tipoEventoService: TipoEventoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTiposEvento();
  }

  cargarTiposEvento(): void{
    this.tipoEventoService.listar().subscribe(
      data => {
        this.TiposEventos =  data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  borrar(id: number | any){
    this.tipoEventoService.eliminar(id).subscribe(
      data => {
        this.toastr.success('Tipo Evento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarTiposEvento();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }
}
