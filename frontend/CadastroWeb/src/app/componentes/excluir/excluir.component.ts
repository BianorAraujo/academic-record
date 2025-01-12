import { Component, Inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../models/Usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.component.html',
  styleUrls: ['./excluir.component.css']
})
export class ExcluirComponent implements OnInit {

  inputData: any;
  usuario!: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ref: MatDialogRef<ExcluirComponent>,
    private snackBar: MatSnackBar
    ){}

  ngOnInit(): void {

    this.inputData = this.data;

    this.usuarioService.GetUsuario(this.inputData.id).subscribe((data) => {
      this.usuario = data;
    });
  }

  excluir(){
    this.usuarioService.ExcluirUsuario(this.inputData.id).subscribe((data) => {
      this.ref.close({ success: true, cancel: false });
    });
  }

  cancelar(){
    this.ref.close({ cancel: true });
  }
}
