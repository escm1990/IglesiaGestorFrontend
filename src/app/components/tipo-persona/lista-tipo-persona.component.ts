import { TipoPersona } from './../../models/tipo-persona';
import { ToastrService } from 'ngx-toastr';
import { TipoPersonaService } from './../../service/tipo-persona.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-tipo-persona',
  templateUrl: './lista-tipo-persona.component.html',
  styleUrls: ['./lista-tipo-persona.component.scss']
})
export class ListaTipoPersonaComponent implements OnInit {

  TiposPersona: TipoPersona[] = [];

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTipoPersona();
  }

  cargarTipoPersona() {
    this.tipoPersonaService.listar().subscribe(
      data => {
        this.TiposPersona = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    )
  }

  borrar(id: number | any){
    this.tipoPersonaService.eliminar(id).subscribe(
      data => {
        this.toastr.success('Tipo Evento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarTipoPersona();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

}
