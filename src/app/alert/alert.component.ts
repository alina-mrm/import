import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: object) {

  }

}
