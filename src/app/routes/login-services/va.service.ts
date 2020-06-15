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
    constructor(private http: HttpClient, private router: Router) {}

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

        return this.http.post<any>('https://sandbox-api.va.gov/oauth2/token', queryInputs, options).pipe(map(data => {
            localStorage.setItem('vaUser', JSON.stringify({username, token: data.access_token}));
            options.headers = options.headers.set('Authorization', `Bearer ${data.access_token}`);
            return data;
        }, err => {}));
    }

    patientInfo(patientId: string) {
        const patientParams = new HttpParams({fromString: `${patientId}`});
        options['params'] = patientParams;
        return this.http.get<any>('https://sandbox-api.va.gov/services/fhir/v0/dstu2/Patient/' + patientId, options)
        .pipe(map(patientReturnedData => {
          return patientReturnedData;
      }));
    }

    conditionInfo(patientId: string) {
        const patientParams = new HttpParams({fromString: `${patientId}`});
        options['params'] = patientParams;
        return this.http.get<any>('https://sandbox-api.va.gov/services/fhir/v0/dstu2/Condition?_count=50&patient=' + patientId, options)
        .pipe(map(conditionReturnedData => {
          return conditionReturnedData;
      }));
    }
}