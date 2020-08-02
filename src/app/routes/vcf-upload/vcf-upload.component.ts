import { Component } from "@angular/core";
import { FileParsingService } from "../entry-and-visualization/vcf-reader/file-parsing.service"

@Component({templateUrl: 'vcf-upload.component.html'})
export class VCFUploadComponent {
    constructor(
        private fileParsingService: FileParsingService
    ) {}

    uploadFile($event) {
        this.fileParsingService.createVariantObjects($event);
    }
}
