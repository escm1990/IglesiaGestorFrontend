import { IglesiaService } from './../../service/iglesia.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoPersonaService } from './../../service/tipo-persona.service';
import { TipoPersona } from './../../models/tipo-persona';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tipo-persona',
  templateUrl: './detalle-tipo-persona.component.html',
  styleUrls: ['./detalle-tipo-persona.component.scss']
})
export class DetalleTipoPersonaComponent implements OnInit {

  tipoPersona: TipoPersona;
  nombreIglesia = '';

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private iglesiaService: IglesiaService
  ) { }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params.id;
    this.tipoPersonaService.detalle(id).subscribe(
      data => {
        this.tipoPersona = data;
        this.obtenerIglesia(this.tipoPersona.iglesia_id);
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

  obtenerIglesia(id: number){
    this.iglesiaService.detalle(this.tipoPersona.iglesia_id).subscribe(
      data =>{
        this.nombreIglesia = data.nombre.toString();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle2)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.volver();
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/tipo_persona/listar']);
  }

}
