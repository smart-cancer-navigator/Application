import { Component, OnInit } from "@angular/core";
import { FileParsingService } from "../entry-and-visualization/vcf-reader/file-parsing.service"

@Component({templateUrl: 'vcf-upload.component.html'})
export class VCFUploadComponent implements OnInit{
    constructor(
        private fileParsingService: FileParsingService
    ) {}

    ngOnInit() {
        
        var name = localStorage.getItem("fileName");
        if (name != null) {
            this.fileName = name;
        }
        
    }
    
    fileName: string = "No file currently uploaded.";
    uploadFile($event) {
        var file = $event.target.files[0];
        this.fileName = file.name;
        this.fileParsingService.createVariantObjects($event);
    }
}
