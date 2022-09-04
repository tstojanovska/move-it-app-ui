import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalDetailsComponent } from './proposal-details/proposal-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'proposal-list', component: ProposalListComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'proposal-details/:id', component: ProposalDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
