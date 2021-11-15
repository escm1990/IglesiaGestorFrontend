import { TokenService } from './../service/token.service';
import { IglesiaService } from './../service/iglesia.service';
import { Component, OnInit } from '@angular/core';
import { Iglesia } from '../models/iglesia';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-iglesia',
  templateUrl: './lista-iglesia.component.html',
  styleUrls: ['./lista-iglesia.component.scss']
})
export class ListaIglesiaComponent implements OnInit {


  Iglesias: Iglesia[] = [];
  roles: string[];
  isAdmin = false;

  constructor(
    private IglesiaService: IglesiaService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.cargarIglesias();
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  cargarIglesias(): void {
    this.IglesiaService.listar().subscribe(
      data => {
        this.Iglesias = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  borrar(id: number | any) {
    this.IglesiaService.eliminar(id).subscribe(
      data => {
        this.toastr.success('Iglesia Eliminada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarIglesias();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

}
