import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore/compat';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore:AngularFirestore) { }

  public insert(coleccion:string,datos:any){
    return this.angularFirestore.collection(coleccion).add(datos);
  }
}
