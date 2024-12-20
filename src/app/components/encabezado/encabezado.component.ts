import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {

  @Input()
  titulo: string = "";

  @Input()
  shouldGoBack: boolean = false;

  @Input()
  defaultHref = "/";

  constructor() { }
  
  ngOnInit() {
    this.titulo = this.titulo.slice(0, 1).toUpperCase() + this.titulo.slice(1);
  }

}
