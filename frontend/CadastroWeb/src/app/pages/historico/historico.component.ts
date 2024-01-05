import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { EscolaridadeService } from '../../services/escolaridade.service';
import { HistoricoEscolar } from '../../models/HistoricoEscolar';
import { UploadComponent } from '../../componentes/upload/upload.component';
import { HistoricoService } from '../../services/historico.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit{

  usuario?: Usuario;
  id!: number;
  nivelEscolar?: string;
  hasHistoricos: boolean = false;
  historicos: HistoricoEscolar[] = [];

  colunas = ['Nome', 'Download'];
  
  constructor(
    private usuarioService: UsuarioService, 
    private escolaridadeService: EscolaridadeService,
    private historioService: HistoricoService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.usuarioService.GetUsuario(this.id).subscribe((data) => {
      
      const dados = data;
      dados.dataNascimento = new Date(dados.dataNascimento).toLocaleDateString('pt-BR');

      this.usuario = data;

      this.escolaridadeService.GetEscolaridades().subscribe((nivel) => {
        var result = nivel.find((obj) => obj.idEscolaridade == this.usuario?.idEscolaridade);
        this.nivelEscolar = result?.escolaridade;
      });

      this.hasHistoricos = this.usuario.historicos[0] != null;

      if (this.hasHistoricos){
        this.historicos = this.usuario.historicos;
      }

    });
  }

  download(id: number){
    this.historioService.Download(id).subscribe((data) => {
      const blob = new Blob([data], {type : 'application/octet-stream' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      var hist = this.historicos.find(x => x.idHistoricoEscolar == id);
      console.log(hist);

      let filename = hist?.nome +'.'+ hist?.formato;

      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

     });
  }

  excluir(id: number){
    this.historioService.ExcluirHistorico(id).subscribe((data) => {
      window.location.reload();
    })
  }

  openDialog(id?: number){
    this.dialog.open(UploadComponent, {
      width: '350px',
      height: '350px',
      data: {
        id: id
      }
    });
  }

}
