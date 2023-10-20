import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes,Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {
  nombre=""
  apellido=""
  dni=""
  contra=""
  repetir=""
  mail=""
  file:any
  path=""
  constructor(private router: Router, private userService: AuthService, private storage: Storage, private firestore: Firestore,  private code: BarcodeScanner) { }

  ngOnInit() {
  }

  salir(){
    this.router.navigateByUrl("/home", {replaceUrl: true});
  }

  async newImage(event: any) {
    this.file= event.target.files[0];
    this.path= "imagenesUsuariosApp7";
    // console.log(file);
  }

  upload(file: any, path: string , nombre :string){
    const filePath= path + "/"+ nombre ;
     const reffile= ref(this.storage,filePath);
     console.log(file);
    uploadBytes(reffile, file).then(async img =>{
      const test= ref(this.storage,'imagenesUsuariosApp7/'+nombre);
      const imgf= await getDownloadURL(test);
      this.guardarInfo(imgf);
    }).catch(err => console.log(err)); 
    
}
async guardarInfo(url : string){
     
  const placeRef = collection(this.firestore,"UsuariosApp7")
  const Data= {
    nombre: this.nombre,
    apellido: this.apellido,
    dni: this.dni,
    clave: this.contra,
    img: url,
    mail: this.mail
  }
  addDoc(placeRef, Data)
  this.nombre=""
  this.apellido=""
  this.dni=""
  this.contra=""
  this.repetir=""
  this.mail=""
  Swal.fire({
    icon: 'success',
    title: "El usuario se guardo ok",
    heightAuto:false
  })
  }

  escanear(){
    this.code.scan().then(code => {
      //  this.cargarSaldo(code.text)
      console.log(code.text)
    })
    }

    alta(){
      this.verificarMail().then(code => {
      
        if(this.nombre!="" && this.apellido!="" && this.contra!="" && this.repetir!="" && this.contra== this.repetir && this.dni!="" && code!='EXISTE_MAIL'){
         this.upload(this.file, this.path, this.mail);
        }else{
          Swal.fire({
            heightAuto:false,
            icon: "warning",
            title: "Algo salio mal...."
          })
        }
      })
      
    }
  
    async verificarMail() {
      const placeref= collection(this.firestore, 'UsuariosApp7');
      const retorno= collectionData(placeref);
      return new Promise<string> ((resolve) => {
        retorno.subscribe((data) => {
          for (const x of data) {
            if (x['mail'] === this.mail) {
              resolve('EXISTE_MAIL');
            }
          }
          resolve('NO_EXISTE_MAIL');
        })});
      }
}
