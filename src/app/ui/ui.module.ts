import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AppRoutingModule } from '../app-routing/app-routing.module';
import {MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon'; 


@NgModule({
  imports: [
    CommonModule, MatMenuModule,AppRoutingModule, RouterModule, MatIconModule
  ],
  declarations: [LayoutComponent, HeaderComponent, FooterComponent],
  exports: [LayoutComponent]
})
export class UiModule { }
