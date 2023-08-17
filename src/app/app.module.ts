import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';
import { NavComponent } from './nav/nav.component';
import { ImportPreviewComponent } from './import-preview/import-preview.component';
import { ImportComponent } from './import/import.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';
import { ImportService } from './import/import.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ImportPreviewComponent,
    ImportComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    AlertService,
    ImportService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AlertComponent,
  ],
})
export class AppModule {
}
