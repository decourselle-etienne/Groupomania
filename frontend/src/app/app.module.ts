import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GroupomaniaCardComponent } from './groupomania-card/groupomania-card.component';
import { CardListComponent } from './card-list/card-list.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGroupomaniaCardComponent } from './new-groupomania-card/new-groupomania-card.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthModule } from './auth/auth.module';
import { AuthVerify } from './services/auth-verify.service';
import { AuthService } from './services/auth.service';
import { TextareaAutoresizeDirective } from './directives/textarea-autoresize.directive';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    CardListComponent,
    GroupomaniaCardComponent,
    NewGroupomaniaCardComponent,
    HeaderComponent,
    TextareaAutoresizeDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthVerify,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
