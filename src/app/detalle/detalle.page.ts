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
  document:any = {
    id: "",
    data:{} as Idiomas
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      
      this.firestoreService.consultarPorId("Idiomas", this.id).subscribe((resultado:any)=>  {
        if(resultado.payload.data() != null) {
          this.document.id = resultado.payload.id
          this.document.data = resultado.payload.data();
    
          console.log(this.document.data.nombre);
        }else{
          this.document.data = {} as Idiomas;
        } 
    
        });
        
    } else {
      this.id = "";
    }

    
  
  }
  


}
