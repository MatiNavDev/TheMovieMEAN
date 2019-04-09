import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FileSnippet } from '../../models/fileSnippet';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Output() updateImg = new EventEmitter();

  private IMG_SIZE = {
    width: 1280,
    height: 1280
  };

  public selectedFile: FileSnippet;
  public imageChangedEvent;
  public showCropper: boolean = false;

  constructor(public toastSrvc: ToastService) {}

  ngOnInit() {}

  /**
   * Se encaga de manejar el subir una imagen
   * @param event
   */
  public onProcessFile(event: any) {
    this.selectedFile = undefined;
    const URL = window.URL;
    let file, img;

    if (
      (file = event.target.files[0]) &&
      (file.type === 'image/png' || file.type === 'image/jpeg')
    ) {
      img = new Image();

      const self = this;

      // se ejecuta despues de createObjectURL
      img.onload = function() {
        if (this.width < self.IMG_SIZE.width && this.height < self.IMG_SIZE.height) {
          self.showCropper = true;
          self.imageChangedEvent = event;
        } else {
          //Handle Error
          self.toastSrvc.show('La imagen es muy grande.', 'Alerta !', 'warning');
        }
      };

      // crea la imagen en el dom
      img.src = URL.createObjectURL(file);
    }
  }

  /**
   * Evento que emite el cropper cuando la img es croppeada
   * @param file
   */
  public imageCropped(file: File) {
    return (this.selectedFile = { file });
  }

  /**
   * Maneja el guardar y emitir la imagen croppeada
   */
  public onSaveImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      // se ejecuta despues de readAsDataURL
      reader.addEventListener('load', (event: any) => {
        this.selectedFile.src = event.target.result;

        this.selectedFile.pending = true;
        this.showCropper = false;
        this.updateImg.emit(this.selectedFile.file);
      });

      // genera la url para que desde el html se pueda ver la imagen
      reader.readAsDataURL(this.selectedFile.file);
    }
  }

  /**
   * Maneja el cancelar el croppeado
   */
  public onCancelCropping() {
    this.selectedFile = null;
    this.showCropper = false;
  }

  /**
   * Maneja el remover la img seleccionada
   */
  public onRemoveImg() {
    this.selectedFile = null;
    this.imageChangedEvent = null;
    this.updateImg.emit(null);
  }
}
