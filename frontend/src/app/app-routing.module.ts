import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardListComponent } from './card-list/card-list.component';
import { NewGroupomaniaCardComponent } from './new-groupomania-card/new-groupomania-card.component';
import { AuthVerify } from './services/auth-verify.service';

const routes: Routes = [

  { path: 'cards', component: CardListComponent, canActivate: [AuthVerify] },
  { path: 'new-card', component: NewGroupomaniaCardComponent, canActivate: [AuthVerify] },
  { path: 'modify-card/:id', component: NewGroupomaniaCardComponent, canActivate: [AuthVerify] },
  { path: '', pathMatch: 'full', redirectTo: 'cards' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { };
