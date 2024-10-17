import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones de dependencias
  private router = inject(Router);
  private ngFireAuth = inject(AngularFireAuth);
  private ngFirestore = inject(AngularFirestore);

  signIn(email:string, password:string){
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  signUp(email:string, password:string, name:string){
    const user = this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    user.then( userData => { this.ngFirestore.collection('usuarios').doc(userData.user?.uid).set({name, email}); });
    return user;
  }

  signOut(){
    return this.ngFireAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
