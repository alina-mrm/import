import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ImportPreviewDataSource } from './import-preview-datasource';

@Component({
  selector: 'app-import-preview',
  templateUrl: './import-preview.component.html',
  styleUrls: ['./import-preview.component.scss'],
})
export class ImportPreviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @Input() data: Array<Array<string>>;

  dataSource: ImportPreviewDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new ImportPreviewDataSource(this.paginator, this.sort);
  }
}
