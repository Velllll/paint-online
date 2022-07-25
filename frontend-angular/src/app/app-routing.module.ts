import { AppComponent } from './app.component';
import { CanvasComponent } from './pages/canvas/canvas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: AppComponent, 
    children: [
      {path: ':id', component: CanvasComponent},
      { path: '**', redirectTo: `r${Date.now()}`, pathMatch: 'full'}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
