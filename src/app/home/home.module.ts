import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ComponentsModule } from 'src/app/common/components/components.module';
import { GuardsModule } from 'src/app/common/guards/guards.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentsModule,
    GuardsModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
