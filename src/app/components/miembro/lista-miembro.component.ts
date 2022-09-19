import { TokenService } from './../../service/token.service';
import { ToastrService } from 'ngx-toastr';
import { MiembroService } from './../../service/miembro.service';
import { Miembro } from './../../models/miembro';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lista-miembro',
  templateUrl: './lista-miembro.component.html',
  styleUrls: ['./lista-miembro.component.scss']
})
export class ListaMiembroComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarMiembros(): void {

    if(this.isAdmin){
      /* Forma de invocar con Angular inferior a 14
      this.miembroService.listar().subscribe(
        data => {
          this.Miembros = data;
          this.dtTrigger.next(data);
        },
        err => {
          console.log(err);
        }
      );
      */

      this.miembroService.listar().subscribe({
        next: (data) => {
          this.Miembros = data;
          this.dtTrigger.next(data);
        },
        error: (e) => {
          this.toastr.error(e, 'Error (listarPorIglesia)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de miembros finalizada')
      })

    } else {
      this.iglesiaTemp = this.tokenService.getUserIglesiaId();
      this.iglesia_id = +this.iglesiaTemp;

      this.miembroService.listarIglesia(this.iglesia_id).subscribe({
        next: (data) => {
          this.Miembros = data;
          this.dtTrigger.next(data);
        },
        error: (e) => {
          this.toastr.error(e, 'Error (listarPorIglesia)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de miembros finalizada')
      })
    }
  }

  borrar(id: number | any){

    this.miembroService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Miembro Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarMiembros();
      }
    })
  }

}
