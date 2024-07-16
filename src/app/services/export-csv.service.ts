import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {

  constructor() { }

  exportCsv(data: any[], name:string) {
  
    const csv = data.map(row => Object.values(row).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name + '.csv';
    link.click();
  }

}