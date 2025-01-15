import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Idiomas} from '../idiomas';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private firestoreService: FirestoreService) {

    //Crear una tarea vacia
    
  }

  public insertarIdioma(){
    let idioma:Idiomas = {
      nombre: "Ingles",
      descripcion: "Idioma universal"
    }
    this.firestoreService.insert("idiomas",idioma).then(
      (respuesta)=>{
        console.log("Idioma creado correctamente");
      },
      (error)=>{
        console.error(error);
      }
    )
  }



}
