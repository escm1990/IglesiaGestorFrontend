import { IglesiaService } from './../../service/iglesia.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { Component, OnInit } from '@angular/core';
import { TipoEvento } from '../../models/tipo-evento';

@Component({
  selector: 'app-detalle-tipo-evento',
  templateUrl: './detalle-tipo-evento.component.html',
  styleUrls: ['./detalle-tipo-evento.component.scss']
})
export class DetalleTipoEventoComponent implements OnInit {

  tipoEvento: TipoEvento;
  nombreIglesia = '';

  constructor(
    private tipoEventoService: TipoEventoService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private iglesiaService: IglesiaService
    ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.tipoEventoService.detalle(id).subscribe(
      data =>{
        this.tipoEvento = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.volver();
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/tipo_evento/listar']);
  }


}
