import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LoggedComponent } from './logged/logged.component';
import { LoginService } from './login.service';
import { PanelComponent } from './panel/panel.component';
import { DocumentsComponent } from './documents/documents.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatPaginatorModule} from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon'; 

import { InfoMetadadosComponent } from './info-metadados/info-metadados.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { NewDocumentFastComponent, DialogOverviewExampleDialog } from './new-document-fast/new-document-fast.component';
import { HttpClientModule } from '@angular/common/http';

import { FileUploadModule } from 'ng2-file-upload';
import { SearchComponent } from './search/search.component';
import { ShowMetadataComponent } from './show-metadata/show-metadata.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';

import {MatDialogModule} from '@angular/material/dialog';
import { DocumentTinyComponent } from './document-tiny/document-tiny.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { MatTableModule } from '@angular/material/table';
import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './response-reset-password/response-reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoggedComponent,
    PanelComponent,
    DocumentsComponent,
    NewDocumentComponent,
    InfoMetadadosComponent,
    AboutComponent,
    RegisterComponent,
    ProfileComponent,
    NewDocumentFastComponent,
    SearchComponent,
    ShowMetadataComponent,
    LoginComponent,
    ContactComponent,
    DialogOverviewExampleDialog,
    DocumentTinyComponent,
    RequestResetPasswordComponent,
    ResponseResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    UiModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule, MatCheckboxModule, MatTabsModule, BrowserAnimationsModule, MatInputModule, MatGridListModule,
    MatSelectModule, MatRadioModule, MatSliderModule, MatCardModule, MatChipsModule, MatIconModule, RouterModule, MatProgressBarModule,
    MatPaginatorModule,
    HttpClientModule,
    ReactiveFormsModule, 
    FileUploadModule,
    MatDialogModule,
    MatAutocompleteModule, 
    MatFormFieldModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatTableModule
  ],
  providers: [LoginService, ],
  entryComponents: [ DialogOverviewExampleDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
