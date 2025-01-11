import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario';
import { ExcluirComponent } from '../../componentes/excluir/excluir.component';
import { EscolaridadeService } from 'src/app/services/escolaridade.service';
import { NivelEscolar } from 'src/app/models/NivelEscolar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuariosGeral: Usuario[] = [];
  nivelEscolar!: NivelEscolar[];
  hasUsuarios: boolean = false;

  colunas = ['Nome', 'Sobrenome', 'Email', 'DataNascimento', 'Escolaridade', 'Acoes'];

  constructor(
    private usuarioService: UsuarioService, 
    private escolaridadeService: EscolaridadeService, 
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.usuarioService.GetUsuarios().subscribe(data => {
      const dados = data;

      this.escolaridadeService.GetEscolaridades().subscribe((nivel) => {
        this.nivelEscolar = nivel;
      });

      dados.map((item) => {
        item.dataNascimento = new Date(item.dataNascimento!).toLocaleDateString('pt-BR');
      })

      this.usuarios = data;
      this.usuariosGeral = data;
      this.hasUsuarios = this.usuarios != null && this.usuarios.length != 0;
    });
  }

  getNivelEscolar(idEscolar: number){
    return this.nivelEscolar?.find((obj) => obj.idEscolaridade == idEscolar)?.escolaridade;
  }

  search(event : Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    this.usuarios = this.usuariosGeral.filter(usuario => {
      return usuario.nome.toLowerCase().includes(value);
    })
  }

  openDialog(id: number){
    const dialogRef = this.dialog.open(ExcluirComponent, {
      width: '320px',
      height: '300px',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result?.cancel && result?.success){
        this.usuarioService.GetUsuarios().subscribe(data => {
          this.usuarios = data;
          this.usuariosGeral = data;
          this.hasUsuarios = this.usuarios != null && this.usuarios.length != 0;

          this.showSnackBar("User deleted successfully!", true);
        });
      }

      if (!result?.cancel && !result?.success)
        this.showSnackBar("Something went wrong!", false);

    });
  }

  showSnackBar(message: string, success: boolean): void {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: success ? 'snackbar-success' : 'snackbar-error'
    });
  }

}
