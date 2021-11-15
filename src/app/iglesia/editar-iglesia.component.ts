import { Iglesia } from './../models/iglesia';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IglesiaService } from './../service/iglesia.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-iglesia',
  templateUrl: './editar-iglesia.component.html',
  styleUrls: ['./editar-iglesia.component.scss']
})
export class EditarIglesiaComponent implements OnInit {

  iglesia: Iglesia;

  constructor(
    private iglesiaService: IglesiaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.iglesiaService.detalle(id).subscribe(
      data => {
        this.iglesia = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle2)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      }
    );
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.iglesiaService.modificar(id, this.iglesia).subscribe(
      data => {
        this.toastr.success('Iglesia Actualizada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Modificar)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // this.router.navigate(['/']);
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/iglesia/listar']);
  }

}
