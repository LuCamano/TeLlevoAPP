import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() icon!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() type = "text";
  @Input() control!: FormControl;
  @Input() error!: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() onChange: any;

  isPassword = false;
  hide = true;

  ngOnInit() {
    this.isPassword = this.type === "password";
  }

  toggleHidePassword(){
    this.hide = !this.hide;
    this.type = this.hide? "password" : "text";
  }
}
