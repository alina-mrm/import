import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { AlertService } from '../alert/alert.service';
import { ConversionResult, ImportService } from './import.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent {

  data: ConversionResult[];

  constructor(
    private alertService: AlertService,
    private importService: ImportService,
  ) {
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      this.notify('Ошибка', 'Файл не выбран');
      return;
    }

    if (!this.isValidExtension(target.files[0].name)) {
      this.notify('Неверный формат файла', 'Расширение файла должно быть .xls или .xlsx');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.addEventListener('load', (e: any) => {
      try {
        const binaryString = e.target.result;
        const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName: string = workBook.SheetNames[0];
        const sheet = workBook.Sheets[sheetName];
        const data = <Array<Array<string>>>(XLSX.utils.sheet_to_json(sheet, { header: 1 }));

        const limit = 25000;
        if (data.length > limit) {
          throw new Error(`Too large file. Requested to parse ${data.length} rows, but the limit is ${limit}`);
        }

        this.data = this.importService.convert(data);

        this.data.splice(0, 1);

        if (this.data.some(dataItem => dataItem.errors.length > 0)) {
          console.error('There were errors');
          this.data.forEach((dataItem, index) => {
            if (dataItem.errors.length > 0) {
              console.error(`Error at item #${index}: ${dataItem.errors.join(', ')}`, dataItem);
            }
          });
        } else {
          console.log('File has been successfully converted. Exporting to window.list...');
          window['list'] = this.data.map(item => item.student);
          console.log('Done!');
          console.log(JSON.stringify(window['list']));
        }

      } catch (e) {
        console.error('Some error', e);
        this.notify('Неверный формат файла', 'Убедитесь, что загружаете файл шаблона импорта. ' + e.toString());
        return;
      }
      console.log(this.data);
    });

    reader.readAsBinaryString(target.files[0]);
  }

  notify(title: string, message: string): void {
    this.alertService.show(title, message);
  }

  private isValidExtension(name: string): boolean {
    return ['.xls', '.xlsx', '.csv', '.odt']
      .some((ext: string) => name.endsWith(ext));
  }

}
