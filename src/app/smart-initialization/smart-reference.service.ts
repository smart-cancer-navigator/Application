/**
 * Since SMART is a JS library, this is a utility class used to make it easier to work with the JS library.
 * By declaring FHIR below, the library is referenced from .angular-cli.json, and functions can be used
 * directly from the library.  In order to get this to work like global variables, I found that the best way
 * would be to use an Observable, a backend framework of Angular known as RxJS.
 * https://stackoverflow.com/questions/36715918/how-to-define-global-variables-in-angular-2-in-a-way-that-i-
 * can-use-them-for-pro
 * https://stackoverflow.com/questions/34714462/updating-variable-changes-in-components-from-a-service-with-angular2
 */

import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare const FHIR: any;
export const SMARTModule = FHIR;

// Make sure to use BehaviorSubject over Subject, since it provides the current value of the object on subscribe()
export let SMARTClient: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export class SMARTReferenceService {
  ready() {
    SMARTModule.oauth2.ready(function (smart) {
      SMARTClient.next(smart);
    });
  }
}
