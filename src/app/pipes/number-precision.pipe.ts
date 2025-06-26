import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPrecision'
})
export class NumberPrecisionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(typeof(value)=='number'){
      let values = value.toString().split('.')
      if(values[1]){
        if(values[1].length >0){
          let returnValue = values[0] + '.' + values[1].slice(0,2)
          return returnValue
        }
        else return Number(values[0])
      }else return (values[0])
      
    }
    else
    return (value);
  }

}
