import { TokenService } from './../../service/token.service';
import { ToastrService } from 'ngx-toastr';
import { MiembroService } from './../../service/miembro.service';
import { Miembro } from './../../models/miembro';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-miembro',
  templateUrl: './lista-miembro.component.html',
  styleUrls: ['./lista-miembro.component.scss']
})
export class ListaMiembroComponent implements OnInit {

  Miembros: Miembro[] = [];
  roles: string[];
  isAdmin =  false;
  iglesiaTemp: string;
  iglesia_id: number;

  constructor(
    private miembroService: MiembroService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });

    this.cargarMiembros();

  }

  cargarMiembros(): void {

    if(this.isAdmin){
      this.miembroService.listar().subscribe(
        data => {
          this.Miembros = data;
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.iglesiaTemp = this.tokenService.getUserIglesiaId();
      this.iglesia_id = +this.iglesiaTemp;
      this.miembroService.listarIglesia(this.iglesia_id).subscribe(
        data => {
          this.Miembros = data;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  borrar(id: number | any){
    this.miembroService.eliminar(id).subscribe(
      ata => {
        this.toastr.success('Miembro Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarMiembros();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

}
