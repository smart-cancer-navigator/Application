import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const options = {
    headers: new HttpHeaders()
};
@Injectable({ providedIn: 'root' })
export class VAService {
    clientId: string = '0oa7hyx727mtpNfKi2p7';
    clientSecret: string = 'VcN_x8AIuFEnZ8oTHUMd3UnzsTeYp3XWUKscToWy';
    accessToken: string = '';

    constructor(private http: HttpClient, private router: Router) {}

    // get access token and related information from localStorage
    getLocalStorageToken() {
        return JSON.parse(localStorage.getItem('vaData'));
    }

    // we get the access token from this function.
    getToken(username: string, code: string, state: string) {
        options.headers = options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        var idSecretEncode = btoa(this.clientId + ":" + this.clientSecret);
        options.headers = options.headers.set('Authorization', `Basic ${idSecretEncode}`);
        var accessTokenAppend = new URLSearchParams();
        accessTokenAppend.set('grant_type', 'authorization_code');
        accessTokenAppend.set('code', code);
        accessTokenAppend.set('state', state);
        accessTokenAppend.set('redirect_uri', 'http://localhost:4200/app');

        var queryInputs = accessTokenAppend.toString();

        return this.http.post<any>('/oauth2/token', queryInputs, options).pipe(map(data => {
            localStorage.setItem('vaData',  JSON.stringify(data));  
            options.headers = options.headers.set('Authorization', `Bearer ${data.access_token}`);
            
            return data;
        }, err => {}));
    }

    // the patient file contains information on patient demographics
    patientInfo(patientId: string) {
        const patientParams = new HttpParams({fromString: `${patientId}`});
        options['params'] = patientParams;
        options.headers = options.headers.set('Authorization', `Bearer ${this.accessToken}`);
        return this.http.get<any>(`https://sandbox-api.va.gov/services/fhir/v0/argonaut/data-query/Patient/${patientId}`, options)
        .pipe(map(patientReturnedData => {
          return patientReturnedData;
      }));
    }

    // the conditions file contains information about conditions
    conditionInfo(patientId: string) {
        const patientParams = new HttpParams({fromString: `${patientId}`});
        options['params'] = patientParams;
        return this.http.get<any>('https://sandbox-api.va.gov/services/fhir/v0/dstu2/Condition?_count=50&patient=' + patientId, options)
        .pipe(map(conditionReturnedData => {
          return conditionReturnedData;
      }));
    }
}