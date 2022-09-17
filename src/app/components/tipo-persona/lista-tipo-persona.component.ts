import { TipoPersona } from './../../models/tipo-persona';
import { ToastrService } from 'ngx-toastr';
import { TipoPersonaService } from './../../service/tipo-persona.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lista-tipo-persona',
  templateUrl: './lista-tipo-persona.component.html',
  styleUrls: ['./lista-tipo-persona.component.scss']
})
export class ListaTipoPersonaComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  TiposPersona: TipoPersona[] = [];

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTipoPersona();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarTipoPersona() {
    this.tipoPersonaService.listar().subscribe({
      next: (data) => {
        this.TiposPersona = data;
        this.dtTrigger.next(data);
      },
      error: (e) => {
        this.toastr.error(e, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => console.info('Consulta de tipos de persona finalizada')
    })

  }

  borrar(id: number | any){
    this.tipoPersonaService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Tipo de Persona Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarTipoPersona();
      }
    })
  }

}
