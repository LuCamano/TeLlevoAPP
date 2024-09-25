import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  newUserData = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor() { }

  ngOnInit() {
  }

}
