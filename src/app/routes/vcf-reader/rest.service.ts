// communicates with backend Flask server that does the VCF-to-FHIR conversion

import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

@Injectable()
export class RestService  {

    constructor(private http: HttpClient) {}


    // needs a local server running; soon to be configured to not need this
    serverUrl: string = 'http://127.0.0.1:5000/translate';

    readServer(files) {
        const formData: FormData = new FormData();
        formData.append('fileToUpload', files[0], files[0].name);
        return this.http.post(this.serverUrl, formData);
      }
}