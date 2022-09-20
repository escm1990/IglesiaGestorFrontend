import { Observable } from 'rxjs';
import { MiembroService } from './../../service/miembro.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenService } from './../../service/token.service';
import { EventoDetalleService } from './../../service/evento-detalle.service';
import { Miembro } from 'src/app/models/miembro';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nuevo-evento-detalle',
  templateUrl: './nuevo-evento-detalle.component.html',
  styleUrls: ['./nuevo-evento-detalle.component.scss']
})
export class NuevoEventoDetalleComponent implements OnInit {

  comentario = '';
  miembro_id: number;

  formEventoDetalle: FormGroup;
  miembros: Miembro[] = [];

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private eventoDetalleService: EventoDetalleService,
    private miembroService: MiembroService
  ) { }

  ngOnInit(): void {
  }

}
