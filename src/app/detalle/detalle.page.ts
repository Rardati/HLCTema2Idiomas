import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Idiomas } from '../idiomas';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {

  id:string = "";
 idioma:any = {
    id: "",
    data:{} as Idiomas
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) {
    this.idioma.data = {} as Idiomas;
   }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      

      this.firestoreService.consultarPorId("idiomas", this.id).subscribe((resultado:any)=>  {    
        if(resultado.payload.data() != null) {          
          this.idioma.id = resultado.payload.id
          this.idioma.data = resultado.payload.data();    
          console.log(this.idioma.data.nombre);
        }else{          
          this.idioma.data = {} as Idiomas;
        } 
    
        });
        
    } else {
      this.id = "";
    }

    
  
  }
  
  guardar() {
    this.firestoreService.actualizar("idiomas", this.id, this.idioma.data).then(() => {
      this.router.navigate(["/home"]);
    }, (error:any) => {
      console.error(error);
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("idiomas", this.id).then(() => {
      // Actualizar la lista completa
      this.router.navigate(["/home"]);
      // Limpiar datos de pantalla
      this.idioma = {} as Idiomas;
    })

  }

  
    clicBotonModificar(id: string, datos: any) {
      this.router.navigate(['/detalle', id]);
  
  
  
    }

}
