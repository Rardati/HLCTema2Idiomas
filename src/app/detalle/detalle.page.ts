import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Idiomas } from '../idiomas';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  idioma: any = { data: {} };
  nuevoDato: boolean = false;
  imagenSelect: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker

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
          {
            text: 'Eliminar', handler: () => {
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



  async seleccionaImagen() {

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then(
            (results) => {
              if (results.lenght > 0) {
                this.imagenSelect = 'data:image/jpeg;base64,' + results[0];
                console.log("Imagen que se ha seleccionado ( en Base 64):" + this.imagenSelect);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => {
        console.log(err);
      
      });
    }




    async subirImagen() {
      const loading = await this.loadingController.create({
        message:'Please wait...'
      });

      const toast = await this.toastController.create({
        message: 'Imagen subida correctamente',
        duration: 3000
      });

      let nombreCarpeta = "imagenes_raquel";

      loading.present();

      let nombreImagen = `${new Date().getTime()}`;

      this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelect)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            console.log("URL de descarga: " + downloadURL);
            toast.present();
            loading.dismiss();
          })
        })
      }


      async eliminarArchivo(fileURL:string) {
        const toast = await this.toastController.create({
          message:'File was deleted successfully',
          duration: 3000
        });
        this.firestoreService.eliminarArchivoPorURL(fileURL)
        .then(() => {
          toast.present();
        }, (error) => {
          console.error(error);
        })
      }

  }
