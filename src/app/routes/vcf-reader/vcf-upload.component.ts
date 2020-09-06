import { Component, OnInit, ViewChild } from "@angular/core";
import { FileParsingService } from "./file-parsing.service";
import { RestService } from "./rest.service";
import { FhirDownloadService } from "./fhir-download.service";

@Component({templateUrl: 'vcf-upload.component.html'})
export class VCFUploadComponent implements OnInit{
    constructor(
        private fileParsingService: FileParsingService,
        private restService: RestService,
        private fhirDownloadService: FhirDownloadService
    ) {}

    @ViewChild('fileInput') fileInput;
    receivedFile: any;
    ngOnInit() {
        
        var name = localStorage.getItem("fileName");
        if (name != null) {
            this.fileName = name;
        }
    }
    
    handleFileInput(files: FileList) {
        console.log('Inside handleFileInput');
        this.receivedFile = files.item(0);
        const isFileupload = true;
        console.log(` Received File: ${this.receivedFile}`);
    
    }

    uploadFile() {
        console.log("uploading file")
        const files: FileList = this.fileInput.nativeElement.files;
        if (files.length === 0) {
          console.log("no file content here");
          return;
        }
        var name = files[0].name;
        this.fileName = name;
        console.log("not empty");
        this.restService.readServer(files).subscribe((data: any)=> {
          this.fileParsingService.createVariants(data, name);
        })
    
      }

    fileName: string = "No file currently uploaded.";
    // uploadFile($event) {
    //     var file = $event.target.files[0];
    //     this.fileName = file.name;
    //     this.fileParsingService.createVariantObjects($event);
    // }

    downloadFile() {

      var file = localStorage.getItem("fhir")
      console.log(file);
      this.fhirDownloadService.downloadFhir(file);
    }
}
