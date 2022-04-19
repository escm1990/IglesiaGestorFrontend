import { ToastrService } from 'ngx-toastr';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { TipoRegistro } from './../../models/tipo-registro';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-tipo-registro',
  templateUrl: './lista-tipo-registro.component.html',
  styleUrls: ['./lista-tipo-registro.component.scss']
})
export class ListaTipoRegistroComponent implements OnInit {

  TiposRegistro: TipoRegistro[] = [];

  constructor(
    private tipoRegistroService: TipoRegistroService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarTipoRegistro();
  }

  cargarTipoRegistro(){
    this.tipoRegistroService.listar().subscribe(
      data => {
        this.TiposRegistro = data
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    )
  }

  borrar(id: number | any){
    this.tipoRegistroService.eliminar(id).subscribe(
      data => {
        this.toastr.success('Tipo Registro Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarTipoRegistro();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }
}
