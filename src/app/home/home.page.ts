import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Idiomas} from '../idiomas';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  
        
  
  arrayColeccionIdiomas: any = [];
  idiomas: any = {};

  constructor(private router: Router, private firestoreService: FirestoreService) {
    this.idiomas = {} as Idiomas;

    this.obtenerIdiomas();
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  

  


/*
    //Crear una tarea vacia
    this.idiomas = {} as Idiomas;

    this.obtenerIdiomas();
        
  
*/

  clicBotonInsertar() {
    this.firestoreService.insertar("idiomas", this.idiomas).then(() => {
      console.log('Idioma creado correctamente!');
      this.idiomas = {} as Idiomas;
    }, (error:any) => {
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

  idIdiomaSelec: string = "";
  
  selectIdioma(idIdioma:any) {
    console.log("Idioma seleccionado: ");
    console.log(idIdioma);
    this.idIdiomaSelec = idIdioma.id;
    this.idiomas.nombre =  idIdioma.data.nombre;
    this.idiomas.descripcion =  idIdioma.data.descripcion;
    this.idiomas.nivel =  idIdioma.data.nivel;
    this.idiomas.horario =  idIdioma.data.horario;
    this.idiomas.precio =  idIdioma.data.precio;

    
    
  }

 
  clicBotonBorrar() {
    this.firestoreService.borrar("idiomas", this.idIdiomaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerIdiomas();
      // Limpiar datos de pantalla
      this.idiomas = {} as Idiomas;
       
    })

  }

  
    clicBotonModificar(id: string, datos: any) {
      this.router.navigate(['/detalle', id]);
  
  
  
    }

  

}
