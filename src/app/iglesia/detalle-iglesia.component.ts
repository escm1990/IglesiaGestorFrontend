import { Iglesia } from './../models/iglesia';
import { ToastrService } from 'ngx-toastr';
import { IglesiaService } from './../service/iglesia.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-iglesia',
  templateUrl: './detalle-iglesia.component.html',
  styleUrls: ['./detalle-iglesia.component.scss']
})
export class DetalleIglesiaComponent implements OnInit {

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
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.volver();
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/iglesia/listar']);
  }

}
