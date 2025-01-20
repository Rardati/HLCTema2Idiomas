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

    idiomasEditando: Idiomas;
    arrayColeccionIdiomas: any = [{
        id: "",
        data: {} as Idiomas
    }];
    

  constructor(private firestoreService: FirestoreService) {

    //Crear una tarea vacia
    this.idiomasEditando = {} as Idiomas;

    this.obtenerIdiomas();
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("idiomas", this.idiomasEditando).then(() => {
      console.log('Idioma creado correctamente!');
      this.idiomasEditando = {} as Idiomas;
    }, (error) => {
      console.error(error);
    });
  }  


  obtenerIdiomas() {
    this.firestoreService.consultar("idiomas").subscribe((resultadoConsultaIdiomas) => {
      this.arrayColeccionIdiomas = [];
      resultadoConsultaIdiomas.forEach((datosIdiomas: any) => {
        this.arrayColeccionIdiomas.push({
          id: datosIdiomas.payload.doc.id,
          data: datosIdiomas.payload.doc.data()
        });
      })
    });
  }

  

}
