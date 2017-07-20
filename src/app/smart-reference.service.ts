declare const FHIR: any;

export class SMARTReferenceService {
  static smartClient: any;

  static FHIRClientInstance(): any {
    return FHIR;
  }

  static SMARTClientInstance(): any {
    return this.smartClient;
  }

  static ready(): void {
    FHIR.oauth2.ready(function (smart) {
      this.smartClient = smart;
      console.log('Obtained client successfully', this.smartClient);
    });
  }
}
