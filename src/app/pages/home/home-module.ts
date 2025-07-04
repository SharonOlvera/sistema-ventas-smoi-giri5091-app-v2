import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home';
import { MaterialModule } from '../../material.module';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    Home
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    MatIconModule
  ]
})
export class HomeModule { }
