import { IFilterableSearchOption } from "../entry-and-visualization/filterable-search/filterable-search.component";
import { IMergeable, MergeProperties } from "../entry-and-visualization/data-merging";
import { DrugReference } from "../entry-and-visualization/variant-visualization/drugs/drug";
import { Injectable } from "@angular/core";
import { AssocReference } from "../entry-and-visualization/variant-visualization/assocs/assocs";
import { GeneReference } from "../entry-and-visualization/genomic-data"

/*
This is the useful information that comes from a VCF file.
All the information stored in this datatype is enough to query to myvariant.info
*/
// from direct VCF reading - not useful anymore, delete later
// export class VCFVariant {
//     chromosome: number;
//     position: number;
//     gene: string;
//     ref: string;
//     alt: string;
//     constructor(
//         chromosome: number,
//         position: number,
//         gene: string,
//         ref: string,
//         alt: string
//     ) {
//         this.chromosome = chromosome;
//         this.position = position;
//         this.gene = gene;
//         this.ref = ref;
//         this.alt = alt;
//     }
    
// }


export class VcfVariant {
    position: number;
    gene: string;
    ref: string;
    alt: string;
    constructor(
        position: number,
        gene: string,
        ref: string,
        alt: string
    ) {
        this.position = position;
        this.gene = gene;
        this.ref = ref;
        this.alt = alt;
    }
    
}


/**
 This is the same as the VariantReference class in src/app/routes/entry-and-visualization/genomic-data.
    The difference: this is for VCFs, meaning it needs to have a little bit more information.
    Specifically, the reference and alternate alleles, and the chromosome position.
    This is so that we have information common between the API and the VCF file.
    We can then see if the chromosome position and the alleles match; if they don't, then we remove them from our list.
 */
export class VCFVariantReference implements IFilterableSearchOption, IMergeable {
    constructor(
        _origin: GeneReference,
        _variantName: string,
        _hgvsID: string,
        ref: string,
        alt: string,
        pos: number
    ) {
        this.origin = _origin;
        this.variantName = _variantName;
        this.hgvsID = _hgvsID;
        this.ref = ref;
        this.alt = alt;
        this.pos = pos;
    }
    origin: GeneReference;
    variantName: string;
    hgvsID: string;
    ref: string;
    alt: string;
    pos: number;

    optionName = () => {
        return this.origin.hugoSymbol + " " + this.variantName + " " + this.origin.entrezID + " " + this.hgvsID;
    }

    /**
     * Merging methods
     */
    mergeable = (other: VCFVariantReference) => {
        return this.variantName === other.variantName && this.origin.mergeable(other.origin);
    }

    // Merges another variant reference into this variant reference (overwriting properties if the property of one is undefined).
    merge = (other: VCFVariantReference) => {
        // Determine which HGVS ID to use since we don't want to mess this one up.
        if (other.hgvsID.indexOf("chr") !== -1)
        this.hgvsID = other.hgvsID;
        else if (this.hgvsID.indexOf("chr") !== -1)
        other.hgvsID = this.hgvsID;

        // Merge both genes.
        this.origin.merge(other.origin);

        console.log("Merged " + this.toString() + " and " + other.toString());
    }

    toString = (): string => {
        return this.origin.toString() + " " + this.variantName + " " + this.hgvsID;
    }
}