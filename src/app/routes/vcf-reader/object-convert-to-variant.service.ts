/*
All the variants from a VCF are formatted in file-parsing.service.
From there, they need to be moved to variant-entry-and-visualization.component
To do this, it has to be placed into localStorage. However, localStorage only
    allows strings as inputs, so the Variant array has to be stringified.
Once the localStorage string is accessed in variant-entry-and-visualization.component,
    it can be parsed to get an object.
This service file specifies how to convert that object back into a Variant.
Because Variants have a lot of other types of objects within them 
    (Genes, Classifications, Pathways, etc), it is placed in a separate file for
    organization purposes.

*/

import { Injectable } from "@angular/core";
import { Variant, Gene, Pathway, Classification } from "../entry-and-visualization/genomic-data"
import { DrugReference } from "../entry-and-visualization/variant-visualization/drugs/drug";
import { VariantSelectorComponent } from "../entry-and-visualization/variant-selector/variant-selector.component";

@Injectable()
export class ObjectConvertToVariantService {
    constructor(

    ) {}


    // Central function of the service
    // variant-entry-and-visualization.component will call this function
    convertToVariant(objVariant): Variant {
        
        // STEP 1: get all information needed for a Variant constructor
        var variantName = objVariant.variantName;
        var hgvsId = objVariant.hgvsID;
        var originObj = objVariant.origin;
        var origin = this.convertToGene(originObj);
        var variant = new Variant(origin, variantName, hgvsId);
        
        // STEP 2: get all the other information
        variant.score = objVariant.score;
        variant.description = objVariant.description;
        variant.somatic = objVariant.somatic;
        variant.types = objVariant.types;
        variant.drugs = this.convertToDrugReferences(objVariant.drugs);
        variant.classifications = this.convertToClassifications(objVariant.classifications);
        variant.diseases = objVariant.diseases;
        variant.chromosome = objVariant.chromosome;
        variant.start = objVariant.start;
        variant.end = objVariant.end;

        return variant;
    }

    convertToGene(objGene): Gene {

        // STEP 1: get all information needed for a Variant constructor
        var hugoSymbol = objGene.hugoSymbol;
        var gene = new Gene(hugoSymbol);

        // STEP 2: Fill in all other information
        gene.entrezID = objGene.entrezID;
        gene.name = objGene.name;
        gene.description = objGene.description;
        gene.type = objGene.type;
        gene.aliases = objGene.aliases;
        gene.pathways = this.convertToPathways(objGene.pathways);
        gene.chromosome = objGene.chromosome;
        gene.start = objGene.start;
        gene.end = objGene.end;
        gene.strand = objGene.strand;
        

        return gene;
    }

    convertToPathways(objPathways): Pathway[] {
        var pathways: Pathway[] = [];
        for (var i = 0; i < objPathways.length; i++) {
            var objPathway = objPathways[i];
            var pathway = new Pathway(objPathway.id, objPathway.name);
            pathways.push(pathway);
        }
        return pathways;
    }
    convertToDrugReferences(objReferences): DrugReference[] {
        var drugs: DrugReference[] = [];
        for (var i = 0; i < objReferences.length; i++) {
            var objReference = objReferences[i];
            var reference = new DrugReference(objReference.name);
            drugs.push(reference);
        }
        return drugs;
    }

    convertToClassifications(objClassifications): Classification[] {
        var classifications: Classification[] = [];
        for (var i = 0; i < objClassifications.length; i++) {
            var objClassification = objClassifications[i];
            var classification = new Classification(objClassification.name, "");
            classification.sources = objClassification.sources;
            classifications.push(classification);
        }

        return classifications;
    }
}