import { NgModule, ErrorHandler } from '@angular/core';
//import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { ProfilPage } from '../pages/profil/profil';
import { FormPage } from '../pages/form/form';


import { Routes } from './app.routes';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProfilPage,
    FormPage
  ],
  imports: [
    //IonicModule.forRoot(MyApp, Routes.getDeepLinkerConfig(), {
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      mode: 'md',
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProfilPage,
    FormPage,

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
