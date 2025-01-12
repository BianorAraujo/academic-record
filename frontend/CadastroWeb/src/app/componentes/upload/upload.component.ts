import { Component, Inject, OnInit } from '@angular/core';
import { ExcluirComponent } from '../excluir/excluir.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoricoService } from '../../services/historico.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  idUsuario: any;
  selectedFile: any = null;

  constructor(
    private historicoService: HistoricoService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ref: MatDialogRef<ExcluirComponent>
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.data.id;
  }

  onFileSelected(data: any): void {
    this.selectedFile = data.target.files[0] ?? null;
  }

  salvar(){
    const formData = new FormData();
    formData.append('id', this.idUsuario);
    formData.append('file', this.selectedFile);

    this.historicoService.Upload(formData).subscribe((data) => {
      console.log(data);
      this.ref.close({ success: true, cancel: false });
    });
  }

  cancelar(){
    this.ref.close({ cancel: true });
  }
}
