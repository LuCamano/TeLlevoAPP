import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones de dependencias
  private ngFireAuth = inject(AngularFireAuth);
  private ngFirestore = inject(AngularFirestore);

  signIn(email:string, password:string){
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  signUp(email:string, password:string){
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  signOut(){
    return this.ngFireAuth.signOut();
  }
}
