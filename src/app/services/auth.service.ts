import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDoc, setDoc, doc } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { Usuario } from '../models/models';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones de dependencias
  private router = inject(Router);
  private ngFireAuth = inject(AngularFireAuth);
  private ngFirestore = inject(AngularFirestore);
  private utils = inject(UtilsService);

  signIn(email:string, password:string){
    const user = this.ngFireAuth.signInWithEmailAndPassword(email, password);
    user.then( async userRef => { 
      const userData = await this.getDocument(`usuarios/${userRef.user?.uid}`);
      this.utils.saveInLocalStorage('user', userData);
    });
    return user;
  }

  signUp(email:string, password:string, name:string, lastName:string){
    const user = this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    user.then( userRef => { this.setDocument(`usuarios/${userRef.user?.uid}`, {name, lastName, email, uid: userRef.user?.uid}) });
    return user;
  }

  signOut(){
    return this.ngFireAuth.signOut().then(() => {
      localStorage.clear();
    });
  }

  setDocument(path:string, data:any) {
    return setDoc(doc(this.ngFirestore.firestore, path), data);
  }

  async getDocument(path:string) {
    return (await getDoc(doc(this.ngFirestore.firestore, path))).data();
  }

  async getCurrentUserData() {
    const currentUid = await this.ngFireAuth.currentUser.then( user => user?.uid);
    return (await this.getDocument(`usuarios/${currentUid}`)) as Usuario;
  }

  isLoggedIn() {
    return this.ngFireAuth.authState;
  }
}
