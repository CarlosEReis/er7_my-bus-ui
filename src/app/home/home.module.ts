import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { KnobModule } from 'primeng/knob';
import { SpeedDialModule } from 'primeng/speeddial';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { ImageModule } from 'primeng/image';

import { FormsModule } from '@angular/forms';

import { StyleClassModule } from 'primeng/styleclass';
import { GeoLocalizacaoComponent } from './geo-localizacao/geo-localizacao.component';


@NgModule({
  declarations: [
    HomeComponent,
    GeoLocalizacaoComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,

    // BrowserModule,
    // BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TagModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    RadioButtonModule,
    SelectButtonModule,
    SpeedDialModule,
    KnobModule,
    SidebarModule,
    DialogModule,
    ImageModule,

    CardModule,
    AutoCompleteModule,
    StyleClassModule,
  ],
})
export class HomeModule {}
