import { TipoRegistro } from './../../models/tipo-registro';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tipo-registro',
  templateUrl: './detalle-tipo-registro.component.html',
  styleUrls: ['./detalle-tipo-registro.component.scss']
})
export class DetalleTipoRegistroComponent implements OnInit {

  tipoRegistro: TipoRegistro;

  constructor(
    private tipoRegistroService: TipoRegistroService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params.id;
    this.tipoRegistroService.detalle(id).subscribe(
      data => {
        this.tipoRegistro = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)',
        {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.volver();
      }
    )
  }

  volver(): void {
    this.router.navigate(['/dashboard/tipo_registro/listar']);
  }

}

