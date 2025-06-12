import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import localePt from '@angular/common/locales/pt';
import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";

import { AuthHttpInterceptor, authHttpInterceptorFn, AuthModule, provideAuth0 } from '@auth0/auth0-angular';


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
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { StyleClassModule } from 'primeng/styleclass';
import { environment } from 'src/environments/environment';

const URL_API = environment.apiUrl; // Replace with your actual API URL

registerLocaleData(localePt);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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

    AuthModule.forRoot({
      domain: 'er7dev.us.auth0.com',
      clientId: '6be2DTY0RooPavwgE2lX7vpiAVsngeVX',
      authorizationParams: {
        audience: 'http://localhost:8080',
        redirect_uri: window.location.origin,
      },
      httpInterceptor: {
        allowedList: [`${URL_API}/linhas*`, `${URL_API}linhas/*`],
      },
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideHttpClient(),
    AuthHttpInterceptor,
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
