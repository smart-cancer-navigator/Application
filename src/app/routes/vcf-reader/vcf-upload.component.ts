import { Component, OnInit, ViewChild } from "@angular/core";
import { FileParsingService } from "./file-parsing.service";
import { RestService } from "./rest.service";
import { FhirDownloadService } from "./fhir-download.service";
import { NoFileChosenModalComponent } from "./modals/no-file-chosen-modal.component"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FileInstructionsModalComponent } from "./modals/file-instructions-modal.component"
import { ServerErrorModalComponent } from "./modals/server-error-modal.component"

@Component({templateUrl: 'vcf-upload.component.html'})
export class VCFUploadComponent implements OnInit{
    constructor(
        private fileParsingService: FileParsingService,
        private restService: RestService,
        private fhirDownloadService: FhirDownloadService,
        private modalService: NgbModal,
    ) {}

    @ViewChild('fileInput') fileInput;
    receivedFile: any;
    displayError: boolean = false;

    ngOnInit() {
        
        var name = localStorage.getItem("fileName");
        if (name != null) {
            this.fileName = name;
        }
    }
    
    handleFileInput(files: FileList) {
        this.receivedFile = files.item(0);
        const isFileupload = true;
        console.log(` Received File: ${this.receivedFile}`);
    
    }

    uploadFile() {
        console.log("Attempting upload")
        const files: FileList = this.fileInput.nativeElement.files;
        if (files.length === 0) {
          console.log("No file was submitted");
          this.showSubmitErrorModal();
          return;
        }
        var name = files[0].name;
        
        this.restService.readServer(files).subscribe((data: any)=> {
          this.fileName = name;
          this.fileParsingService.createVariants(data, name);
          console.log("File successfully uploaded")
        },
        error => {
          console.log("Server error");
          this.showServerErrorModal();
        });
        
    
      }

    fileName: string = "No file currently uploaded.";
    // uploadFile($event) {
    //     var file = $event.target.files[0];
    //     this.fileName = file.name;
    //     this.fileParsingService.createVariantObjects($event);
    // }

    downloadFile() {

      var file = localStorage.getItem("fhir")
      if (file == null) {
        this.showSubmitErrorModal();
        return;
      }
      console.log(file);
      this.fhirDownloadService.downloadFhir(file);
    }

    showSubmitErrorModal() {
      const modalRef = this.modalService.open(NoFileChosenModalComponent, {size: "lg"});
    }

    showInstructionsModal() {
      const modalRef = this.modalService.open(FileInstructionsModalComponent, {size: "lg"});
    }

    showServerErrorModal() {
      const modalRef = this.modalService.open(ServerErrorModalComponent, {size: "lg"});
    }
}
