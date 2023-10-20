import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuario:any;
  usuarios:any[]=[]
  constructor(private firestore:Firestore, private router:Router, private authService: AuthService) {
    
    const placeref= collection(this.firestore, 'usuarios');
    
    const retorno= collectionData(placeref);
    retorno.subscribe(data =>
    {
    for (const x of data){
      if(x['correo']=== this.authService.retornarUsuario() ){
        this.usuario= x;
      }
    }
    }) }

  ngOnInit() {
    const placeref= collection(this.firestore, 'UsuariosApp7');
    
    const retorno= collectionData(placeref);
    retorno.subscribe(data =>
    {
      this.usuarios=[]
      data.forEach((u:any) =>{
        this.usuarios.push(u)
      })
    })
  }

  Alta(){
    if(this.usuario['perfil']=="admin"){
      this.router.navigateByUrl('home/alta')
    }else{
      Swal.fire({
        icon:'error',
        title:'No tenes permisos para dar alta',
        heightAuto: false,
      })
    }
  }

  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true});
   }
}
