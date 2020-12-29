import { Injectable } from "@angular/core";
import { VCFVariantReference, VcfVariant } from "./vcf-objects";
import { VCFMyVariantInfoSearchService } from "./vcf-myvariantinfo-search.service"
import { VariantReference, Variant } from "../entry-and-visualization/genomic-data";
import { Observable } from "rxjs"
import { IGeneDatabase, IVariantDatabase } from "../entry-and-visualization/variant-selector/variant-selector.service";
import { MyGeneInfoSearchService } from "../entry-and-visualization/genomic-data-providers/mygeneinfo-search.service";


@Injectable()
export class FileParsingService {
    constructor(
        private vcfMyvariantinfoSearchService: VCFMyVariantInfoSearchService,
        private mygeneinfoSearchService: MyGeneInfoSearchService
    ) {}
    
    variantDatabases: IVariantDatabase[] = [this.vcfMyvariantinfoSearchService];
    geneDatabases: IGeneDatabase[] = [this.mygeneinfoSearchService];
    

    // from direct VCF reading - not useful anymore, delete later
    // createVariantObjects($event) {
    //     var file = $event.target.files[0]; // outputs the first file
    //     let fileReader = new FileReader();
    //     fileReader.readAsText(file);
    //     fileReader.onload = (e) => {
    //         var fileName = file.name;
    //         localStorage.setItem("fileName", fileName);
        
    //         var fileContents = String(fileReader.result);
    //         var nameSplit = fileName.split(".");
    //         var geneName = nameSplit[2];
    //         var fileSplitByLine = fileContents.split("\n");
    //         var variantArray: VCFVariant[] = [];
    //         for (var i = 1; i < fileSplitByLine.length; i++) {
    //             var line = fileSplitByLine[i].split("\t");
    //             var chromosome = Number(line[0]);
    //             var position = Number(line[1]);
    //             var ref = line[3];
    //             var alt = line[4];
    //             if (fileSplitByLine[i] != "" && ref != "." && alt != "." && alt != "<CGA_CNVWIN>") { // getting rid of extraneous entries that shouldn't be counted
    //                 var variant = new VCFVariant(chromosome, position, geneName, ref, alt);
    //                 variantArray.push(variant);
    //             }
    //         }

    //         this.vcfMyvariantinfoSearchService.searchByString(geneName).subscribe(data => {
    //             var fullVariants: Variant[] = [];
    //             for (var i = 0; i < data.length; i++) {
    //                 if (this.vcfVariantInFile(data[i], variantArray)) {
    //                     var converted = this.vcfVariantToNormal(data[i]);
    //                     this.getByReference(converted).subscribe(variant => {
    //                         fullVariants.push(variant);
    //                         localStorage.setItem("vcfVariants", JSON.stringify(fullVariants));
                            
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // }

    createVariants(data, name) {
      localStorage.setItem("fhir", JSON.stringify(data,null,"    "));
      localStorage.setItem("fileName", name);
      var nameSplit = name.split('.');
      var geneName = nameSplit[2];
      var variantArray: VcfVariant[] = [];
      var contained = data.contained;
      for (var i = 0; i < contained.length; i++) {
        // if (i != 1) continue;
        var entry = contained[i];
        var component = entry.component;
        if (component == null || component.length != 7) continue;
        var position: number = component[6].valueRange.low.value;
        var ref: string = component[3].valueString;
        var alt: string = component[4].valueString;
        
        

        var variant = new VcfVariant(position, geneName, ref, alt);
        variantArray.push(variant);
      }

      this.vcfMyvariantinfoSearchService.searchByString(geneName).subscribe(data => {
        var fullVariants: Variant[] = [];
        for (var i = 0; i < data.length; i++) {
          if (this.vcfVariantInFile(data[i], variantArray)) {
            var converted = this.vcfVariantToNormal(data[i]);
            
            this.getByReference(converted).subscribe(variant => {
              fullVariants.push(variant);
              localStorage.setItem("vcfVariants", JSON.stringify(fullVariants));
              
            })
          }
        }
      });

    }


    // checks if the current variant from the API was included in the VCF file.
    vcfVariantInFile(vcfVariant: VCFVariantReference, variantArray: VcfVariant[]): boolean {
        for (var i = 0; i < variantArray.length; i++) {
            var fileVariant = variantArray[i];
            if (fileVariant.ref == vcfVariant.ref && fileVariant.alt == vcfVariant.alt && fileVariant.position == vcfVariant.pos) {
                return true;
            }
        }
        return false;
    }

    // converts a VCFVariantReference back to a normal VariantReference (gets rid of ref/alt alleles and position)
    //  those were necessary to compare to variants in the VCF file; that's all done by this point, so we can get rid of that information.
    vcfVariantToNormal(vcfVariant: VCFVariantReference): VariantReference {
        return new VariantReference(vcfVariant.origin, vcfVariant.variantName, vcfVariant.hgvsID);
    }

    public getByReference = (reference: VariantReference): Observable<Variant> => {
        // map them into a array of observables and forkJoin
        console.log("Asked to get variant from ", reference);
        return Observable.forkJoin(this.variantDatabases
          .map(searchService => searchService.getByReference(reference))
        ).map((variantArray: Variant[]) => {
            const mergedVariant: Variant = variantArray[0];
            for (let i = 1; i < variantArray.length; i++) {
              if (mergedVariant.mergeable(variantArray[i])) {
                mergedVariant.merge(variantArray[i]);
              }
            }
            console.log("Got ", mergedVariant);
            return mergedVariant;
          }
        ).mergeMap(variant => {
          return Observable.forkJoin(this.geneDatabases
            .map(geneService => geneService.updateVariantOrigin(variant))
          ).map((updatedVariants: Variant[]) => {
            const mergedVariant: Variant = updatedVariants[0];
            for (let i = 1; i < updatedVariants.length; i++) {
              if (mergedVariant.mergeable(updatedVariants[i])) {
                mergedVariant.merge(updatedVariants[i]);
              }
            }
            console.log("Updated origin to ", mergedVariant);
            return mergedVariant;
          });
        });
      }
}

