import { Component } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent {

  btnAcao = "Cadastrar";
  btnTitulo = "Cadastrar Usuário";

  constructor(private usuarioService: UsuarioService, private router: Router, private snackBar: MatSnackBar) {}

  createUsuario(usuario: Usuario){
    this.usuarioService.CreateUsuario(usuario).subscribe((data) => {
      this.router.navigate(['/']);
      this.snackBar.open("Usuário criado com sucesso!", "Ok");
    })
  }
}
