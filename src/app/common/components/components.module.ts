import { AddButtonComponent } from './add-button/add-button.component';
import { CustomButtonComponent } from './custom-button/custom-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/common/components/header/header.component';
import { MenuComponent } from 'src/app/common/components/menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  imports: [CommonModule, RouterModule, ImageCropperModule],
  exports: [
    HeaderComponent,
    MenuComponent,
    ImageUploadComponent,
    FooterComponent,
    CustomButtonComponent,
    PaginatorComponent,
    AddButtonComponent
  ],
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ImageUploadComponent,
    MenuItemComponent,
    CustomButtonComponent,
    PaginatorComponent,
    AddButtonComponent
  ]
})
export class ComponentsModule {}
