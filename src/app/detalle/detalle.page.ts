import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Idiomas } from '../idiomas';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
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
    if (idRecibido) {
      this.id = idRecibido;
      this.nuevoDato = this.id === "nuevo";

      if (!this.nuevoDato) {
        this.firestoreService.consultarPorId("idiomas_raquel", this.id).subscribe((resultado: any) => {    
          if (resultado.payload.data()) {          
            this.idioma.id = resultado.payload.id;
            this.idioma.data = resultado.payload.data();    
          } else {          
            this.idioma.data = {} as Idiomas;
          } 
        });
      }
    }
  }

  guardar() {
    if (this.nuevoDato) {
      this.firestoreService.insertar("idiomas_raquel", this.idioma.data).then(() => {
        this.router.navigate(["/home"]);
      }).catch(error => console.error(error));
    } else {
      this.firestoreService.actualizar("idiomas_raquel", this.id, this.idioma.data).then(() => {
        this.router.navigate(["/home"]);
      }).catch(error => console.error(error));
    }
  }

  async clicBotonBorrar() {
    if (!this.nuevoDato) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este idioma?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', handler: () => {
              this.firestoreService.borrar("idiomas_raquel", this.id).then(() => {
                this.router.navigate(["/home"]);
              });
            }
          }
        ]
      });

      await alert.present();
    }
  }
}