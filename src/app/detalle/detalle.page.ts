import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Idiomas } from '../idiomas';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {

  id:string = "";
  documentIdioma:any = {
    id: "",
    data:{} as Idiomas
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) {
    this.documentIdioma.data = {} as Idiomas;
   }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      
      this.firestoreService.consultarPorId("Idiomas", this.id).subscribe((resultado:any)=>  {
        if(resultado.payload.data() != null) {
          this.documentIdioma.id = resultado.payload.id
          this.documentIdioma.data = resultado.payload.data();
    
          console.log(this.documentIdioma.data.nombre);
        }else{
          this.documentIdioma.data = {} as Idiomas;
        } 
    
        });
        
    } else {
      this.id = "";
    }

    
  
  }
  
  guardar() {
    this.firestoreService.actualizar("Idiomas", this.id, this.documentIdioma.data).then(() => {
      this.router.navigate(["/home"]);
    }, (error:any) => {
      console.error(error);
    });
  }

}
