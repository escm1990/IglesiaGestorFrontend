import { TipoPersona } from 'src/app/models/tipo-persona';
import { TipoPersonaService } from 'src/app/service/tipo-persona.service';
import { Miembro } from './../../models/miembro';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MiembroService } from './../../service/miembro.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-miembro',
  templateUrl: './detalle-miembro.component.html',
  styleUrls: ['./detalle-miembro.component.scss']
})
export class DetalleMiembroComponent implements OnInit {

  miembro: Miembro;
  tipoPersona: TipoPersona;
  fechaMostrarConversion: string = '';
  fechaMostrarBautismo: string = '';
  fechaMostrarNacimiento: string = '';
  urlImagen = '';
  rutaCarpeta = environment.logos;
  tipoPersonaMostrar: String = '';

  url: any; //Angular 11, for stricter type
	msg = "";

  constructor(
    private miembroService: MiembroService,
    private tipoPersonaService: TipoPersonaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.params.id;

    this.miembroService.detalle(id).subscribe(
      data => {
        this.miembro = data;

        this.tipoPersonaService.detalle(this.miembro.tipo_persona_id).subscribe(
          data => {
            this.tipoPersona = data;
            this.tipoPersonaMostrar = this.tipoPersona.descripcion;
          },
          err => {
            this.toastr.error(err.error.mensaje, 'Error (DetalleTipoPersona1)', {
              timeOut: 3000,  positionClass: 'toast-top-center',
            });
          }
        );

        this.fechaMostrarBautismo = this.milisegundosFecha(this.miembro.fechaBautismo);
        this.fechaMostrarConversion = this.milisegundosFecha(this.miembro.fechaConversion);
        this.fechaMostrarNacimiento = this.milisegundosFecha(this.miembro.fechaNacimiento);
        this.urlImagen = this.rutaCarpeta+this.miembro.foto;

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
    this.router.navigate(['/dashboard/miembro/listar']);
  }

  milisegundosFecha(milisegundos: number) : string{
    var date = new Date(milisegundos);
    var result = date.toLocaleDateString(); // 10/29/2013
    return result;
  }
}
