import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { CharacterFormComponent } from './components/character-form/character-form.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'characters', component: CharacterListComponent, canActivate: [AuthGuard] },
  { path: 'characters/new', component: CharacterFormComponent,canActivate: [AuthGuard] },
  { path: 'characters/:id', component: CharacterDetailComponent, canActivate: [AuthGuard] },
  { path: 'characters/:id/edit', component: CharacterFormComponent },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'audit-logs', component: AuditLogComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/characters' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
