/**
 * Since SMART is a JS library, this is a utility class used to make it easier to work with the JS library.
 * By declaring FHIR below, the library is referenced from .angular-cli.json, and functions can be used
 * directly from the library.  In order to get this to work like global variables, I found that the best way
 * would be to use an Observable, a backend framework of Angular known as RxJS.
 * https://stackoverflow.com/questions/36715918/how-to-define-global-variables-in-angular-2-in-a-way-that-i-
 * can-use-them-for-pro
 * https://stackoverflow.com/questions/34714462/updating-variable-changes-in-components-from-a-service-with-angular2
 */

import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';

declare const FHIR: any;
export const SMARTModule = FHIR;

export var SMARTClient = null;

@Injectable()
export class SMARTReferenceService {
  smartModule: any = FHIR;
  // Since this value changes, we have to have it update based on Observables.
  smartClientSubject: Subject <any> = new Subject <any>();

  myID: string = this.makeID();

  makeID(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  ready() {
    console.log('ID: ' + this.myID);
    this.smartModule.oauth2.ready(function (smart) {
      console.log('Updating');
      SMARTClient = smart;
      console.log('now is ', smart);
    });
  }
}
