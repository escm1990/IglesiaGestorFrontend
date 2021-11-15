import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IglesiaService } from './../service/iglesia.service';
import { Component, OnInit } from '@angular/core';
import { Iglesia } from '../models/iglesia';

@Component({
  selector: 'app-nuevo-iglesia',
  templateUrl: './nuevo-iglesia.component.html',
  styleUrls: ['./nuevo-iglesia.component.scss']
})
export class NuevoIglesiaComponent implements OnInit {

  nombre = '';
  direccion = '';
  telefono = '';
  correo = '';
  fechaFundacion: number;
  logo = '';
  estado = 'ACTIVO';
  pais = '';

  constructor(
    private iglesiaService: IglesiaService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onCreate(): void {
    const iglesia = new Iglesia(this.nombre, this.direccion, this.pais, this.correo, this.telefono, this.estado, this.logo, this.fechaFundacion);
    this.iglesiaService.guardar(iglesia).subscribe(
      data => {
        this.toastr.success('Iglesia Creada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
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
