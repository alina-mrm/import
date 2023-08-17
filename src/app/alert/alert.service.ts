import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AlertComponent } from './alert.component';

@Injectable()
export class AlertService {

  constructor(
    private dialog: MatDialog,
  ) {
  }

  show(title: string, text: string): void {
    const config = new MatDialogConfig();
    config.maxWidth = '450px';
    config.minWidth = '300px';
    config.data = { title, text };
    const dialogRef = this.dialog.open(AlertComponent, config);
  }

}
