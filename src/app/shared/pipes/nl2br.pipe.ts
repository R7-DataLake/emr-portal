import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {

  constructor (private sanitizer: DomSanitizer) { }

  transform(value: string, ...args: unknown[]): string {
    if (typeof value !== 'string') {
      return value;
    }

    let result: any;
    const textParsed = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    result = this.sanitizer.sanitize(SecurityContext.HTML, textParsed);

    return result;
  }

}
