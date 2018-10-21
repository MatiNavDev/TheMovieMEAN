import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/common/components/header/header.component';
import { MenuComponent } from 'src/app/common/components/menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    HeaderComponent,
    MenuComponent,
    FooterComponent
  ],
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
