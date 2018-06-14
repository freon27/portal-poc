import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {Route2Component} from "./route2/route2.component";
import {Route1Component} from "./route1/route1.component";
import {APP_BASE_HREF} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    Route1Component,
    Route2Component,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([

      {path: 'route2', component: Route2Component},
      {path: '**', component: Route1Component}
    ])
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/app2'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
