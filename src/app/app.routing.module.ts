import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppService } from './app.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppService]
})
export class AppRoutingModule { }
