import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { CharacterFormComponent } from './components/character-form/character-form.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';
import { TokenExpiryWarningComponent } from './components/token-expiry-warning/token-expiry-warning.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterListComponent,
    CharacterDetailComponent,
    CharacterFormComponent,
    UserManagementComponent,
    NavbarComponent,
    LoginComponent,
    ChangePasswordModalComponent,
    AuditLogComponent,
    TokenExpiryWarningComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
