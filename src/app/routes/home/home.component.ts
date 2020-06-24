/**
 * The landing page for the app, which tells the user what the app does, what the purpose of the appis, and why
 */
import { Component } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Router } from "@angular/router";

@Component({
  selector: "home",
  template: `
    <div class="infoCard">
      <div class="cardContent">
        <div>
          <h1 class="thick">The Issue</h1>
          <hr>
          <p class="regular">
            In a typical genomic non-SMART Cancer Navigator workflow, oncologists will prescribe a genomic analysis of a patient with a recurrent or metastatic tumor. Next, the genomics laboratory returns an unstructured narrative report relating a set of genes and the variants found in that set. Typically scanned into EHRs as PDF files, these reports persist as irregular unstructured documents of varying lengths. While some reports may be more than 20 pages in length – including characterizations of variants and gene abnormalities, potential targeted therapies, and relevant clinical trial info – others may be brief and without much interpretation. Facing a lack of clear actionability, potential biases in the curation of the reports, and outdated information, oncologists typically access and query several knowledge bases to obtain more comprehensive, up-to-date disease-gene-variant information. Therefore, oncologists must reenter patient data every time they wish to query a knowledge base. Inconsistencies among knowledge bases (i.e. differences in querying syntax, GUIs, APIs, etc.) thus lead to inconveniency and inefficiency.</p>
        </div>
        <div>
          <h1 class="thick">SMART Cancer Navigator's Approach</h1>
          <hr>
          <p class="regular">The SMART Cancer Navigator app securely links patient-specific data from EHRs and genomics laboratories to multiple knowledge bases for interpretation and validation. Through the built-in feedback functionality, meaningful responses regarding the usability and efficacy of the app are conveyed to the designers.
          </p>
        </div>
      </div>
      <div class="cardImage" style="min-width: 300px;">
        <div>
          <img src="/assets/landing-page/app-content.png">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .infoCard {
      margin: 10px 5px;
      overflow: hidden;
    }

    .cardContent {
      float: left;
      width: 70%;
    }

    .cardImage {
      float: left;
      width: 30%;
      min-width: 150px;
      max-width: 100%;
    }

    .cardImage>div, .cardContent>div {
      float: left;
      background-color: white;
      box-shadow: 1px 3px #d5d5d5;
      border: 1px solid #d1d1d1;
      padding: 15px;
      margin: 7px 3px;
    }
    
    .cardImage img {
      width: 100%;
      height: auto;
    }
  `],
  animations: [
  ]
})
export class LandingPageComponent {
  constructor (private router: Router) {}

  navigateToVisualization() {
    this.router.navigate(["/app"]);
  }
}
