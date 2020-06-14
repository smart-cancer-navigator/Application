import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const options = {  
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable({
    providedIn: 'root'
})
export class CMSService {

    clientId:string = 'QoJO4ZUb4uQKoA09mu65jScgDfMZlvgbTQHXsSRn';
    client_secret:string = 'JF3JGS2DqxI5jHICvL3gEMgnPDSBdKBzTy71K0GnQYVq5WcD3rvqCC8gUg7PC0XqpvKHadgYJSJWpW254ZJHtuiXRWNjMLILm1wVO39tmn7uVHbDwIj866Tzd32J5mBp';

    constructor(private http: HttpClient,
    private router: Router) { }
    
    // we get the access token from this function. 
    getCMSToken(username: string, code: string) {
   
        var header = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded');
 
        let accessTokenAppend = new URLSearchParams();
        accessTokenAppend.set('grant_type', 'authorization_code');
        accessTokenAppend.set('redirect_uri', 'http://localhost:4200/app');
        accessTokenAppend.set('client_id', this.clientId);
        accessTokenAppend.set('client_secret', this.client_secret);
        accessTokenAppend.set('code', code);
        let queryInputs = accessTokenAppend.toString();
        
        return this.http.post<any>('https://sandbox.bluebutton.cms.gov/v1/o/token/?' + queryInputs, {header, HttpHeaders}, 
            ).pipe(map(data => {     
            localStorage.setItem('currentUser', JSON.stringify({ username, token: data.access_token}));  
            options.headers = options.headers.set('Authorization', `Bearer ${data.access_token}`);
            return data;           
        },
        error => {}));
    }

    getEOB(patientId: string) {
        const eobParams = new HttpParams({fromString: `patient=${patientId}`});
        options['params'] = eobParams;
        return this.http.get<any>('https://sandbox.bluebutton.cms.gov/v1/fhir/ExplanationOfBenefit/', options)
            .pipe(map(eobData => {          
            localStorage.setItem('eobData', JSON.stringify(eobData));                
            return JSON.stringify(eobData);
        }));
    }
    getPatientInfo(patientId: string) {
        const patientParams = new HttpParams({fromString: `patient=${patientId}`});
        options['params'] = patientParams;
        return this.http.get<any>('https://sandbox.bluebutton.cms.gov/v1/fhir/Patient/', options)
            .pipe(map(patientReturnedData => {
            
            localStorage.setItem('patientData', JSON.stringify(patientReturnedData));                
            return JSON.stringify(patientReturnedData);
        }));
    }
   
    logout() {
        localStorage.removeItem('currentUser');
    }

}
