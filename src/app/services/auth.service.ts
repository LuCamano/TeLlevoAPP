import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDoc, setDoc, doc } from "@angular/fire/firestore";
import { Usuario } from '../models/models';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones de dependencias
  private ngFireAuth = inject(AngularFireAuth);
  private ngFirestore = inject(AngularFirestore);
  private utils = inject(UtilsService);

  async signIn(email:string, password:string){
    const user = await this.ngFireAuth.signInWithEmailAndPassword(email, password); 
    const userData = await this.getDocument(`usuarios/${user.user?.uid}`);
    this.utils.saveInLocalStorage('user', userData);
    return user;
  }

  signUp(email:string, password:string, name:string, lastName:string){
    const user = this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    user.then( userRef => { this.setDocument(`usuarios/${userRef.user?.uid}`, {name, lastName, email, uid: userRef.user?.uid}) });
    return user;
  }

  resetPasswordEmail(email:string) {
    return this.ngFireAuth.sendPasswordResetEmail(email);
  }

  signOut(){
    this.ngFireAuth.signOut();
    localStorage.removeItem('user');
    this.utils.navigateRoot('/login');
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

  getAuthIns() {
    return getAuth();
  }
}
