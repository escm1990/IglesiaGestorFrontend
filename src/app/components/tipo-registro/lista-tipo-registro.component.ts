import { ToastrService } from 'ngx-toastr';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { TipoRegistro } from './../../models/tipo-registro';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lista-tipo-registro',
  templateUrl: './lista-tipo-registro.component.html',
  styleUrls: ['./lista-tipo-registro.component.scss']
})
export class ListaTipoRegistroComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  TiposRegistro: TipoRegistro[] = [];

  constructor(
    private tipoRegistroService: TipoRegistroService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTipoRegistro();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarTipoRegistro(){
    this.tipoRegistroService.listar().subscribe({
      next: (data) => {
        this.TiposRegistro = data;
        this.dtTrigger.next(data);
      },
      error: (e) => {
        this.toastr.error(e, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => console.info('Consulta de Tipos de Registro finalizada')
    })
  }

  borrar(id: number | any){
    this.tipoRegistroService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Tipo de Registro Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarTipoRegistro();
      }
    })
  }
}
