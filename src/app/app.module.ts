import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { USMapComponent } from './us-map/us-map.component';
import { JobNetworkComponent } from './job-network/job-network.component';
import { CompareComponent } from './compare/compare.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [
    AppComponent,
    USMapComponent,
    JobNetworkComponent,
    LegendComponent,
    CompareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
