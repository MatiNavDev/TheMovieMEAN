import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/common/components/header/header.component';
import { MenuComponent } from 'src/app/common/components/menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ImageCropperModule
  ],
  exports:[
    HeaderComponent,
    MenuComponent,
    ImageUploadComponent,
    FooterComponent,
  ],
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ImageUploadComponent
  ]
})
export class ComponentsModule { }
