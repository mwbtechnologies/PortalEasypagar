import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: string, format: string = 'dd-MM-yyyy'): string | null {
    if (!value) return null;

    // Split the date string assuming it's in dd/MM/yyyy hh:mm:ss format
    let parts : any = value.split(/[\s/:]/);
    let date = new Date(+parts[2], parts[1] - 1, +parts[0], +parts[3], +parts[4], +parts[5]);

    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }
}
