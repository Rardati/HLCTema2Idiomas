import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Idiomas } from '../idiomas';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {

  id:string = "";
  /*idioma:any = {
    id: "",
    data:{} as Idiomas
  };*/
  idioma: any = { data: {} };
  nuevoDato: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService, 
    private router: Router,
    private alertController: AlertController
  ) {
    this.idioma.data = {} as Idiomas;
   }

   ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      this.nuevoDato = this.id === "nuevo";
      
      if (!this.nuevoDato) {
        this.firestoreService.consultarPorId("idiomas", this.id).subscribe((resultado: any) => {    
          if (resultado.payload.data() != null) {          
            this.idioma.id = resultado.payload.id;
            this.idioma.data = resultado.payload.data();    
            console.log(this.idioma.data.nombre);
          } else {          
            this.idioma.data = {} as Idiomas;
          } 
        });
      }
    } else {
      this.id = "";
    }
  }

  botonFlotante() {
    this.router.navigate(['/detalle', 'new']);
  }
  
  guardar() {
    if (this.nuevoDato) {
      this.firestoreService.insertar("idiomas", this.idioma.data).then(() => {
        this.router.navigate(["/home"]);
      }, (error: any) => {
        console.error(error);
      });
    } else {
      this.firestoreService.actualizar("idiomas", this.id, this.idioma.data).then(() => {
        this.router.navigate(["/home"]);
      }, (error: any) => {
        console.error(error);
      });
    }
  }

  clicBotonBorrar() {
    if (!this.nuevoDato) {
      this.firestoreService.borrar("idiomas", this.id).then(() => {
        this.router.navigate(["/home"]);
        this.idioma = {} as Idiomas;
      });
    }
  }

  clicBotonModificar(id: string, datos: any) {
    this.router.navigate(['/detalle', id]);
  }
}
