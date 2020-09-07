import { Injectable } from "@angular/core"

@Injectable()
export class FhirDownloadService {

    private setting = {
        element: {
            download: null as HTMLElement
        }
    }

    downloadFhir(data) {
        console.log("Downloading the fhir.json file")
        this.downloadByHtmlTag({
            fileName: "fhir.json",
            text: data
        });
    }

    private downloadByHtmlTag(arg: {
        fileName: string,
        text: string
    }) {
        if (!this.setting.element.download) {
            this.setting.element.download = document.createElement('a');
        }

        const element = this.setting.element.download;
        const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);

        var downloadEvent = new MouseEvent('click');
        element.dispatchEvent(downloadEvent);

    }
}