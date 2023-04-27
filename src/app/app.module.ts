import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { USMapComponent } from './us-map/us-map.component';
import { JobNetworkComponent } from './job-network/job-network.component';
import { CityJobNetworkComponent } from './city-job-network/city-job-network.component';
import { CompareComponent } from './compare/compare.component';
import { LegendComponent } from './legend/legend.component';
import { CityRadialScoreComponent } from './city-radial-score/city-radial-score.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    USMapComponent,
    JobNetworkComponent,
    CityJobNetworkComponent,
    CityRadialScoreComponent,
    LegendComponent,
    CompareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
