import {Component} from "@angular/core";

@Component({
  selector: "db-analysis",
  template: `
    <div class="infoCard">
      <div class="cardContent">
        <div>
          <h1 class="thinFont1">Why Database Analysis?</h1>
          <hr>
          <p class="thinFont1">A pressing issue currently in the research community is that of "research parasites": those who profit off of the research done by other labs without contributing anything meaningful and new.  By carrying out analysis on the each prominent oncology database, we hope to foster a symbiotic relationship between this app and its information sources.  </p>
        </div>
      </div>
      <div class="cardImage">
        <div>
          <img src="/assets/db-analysis/civic-oncokb-comparison.png" class="dbAnalysisImage">
          <img src="/assets/db-analysis/civic-oncokb-comparison-2.png" class="dbAnalysisImage">
          <img src="/assets/db-analysis/clinvar-civic-oncokb-comparison.png" class="dbAnalysisImage">
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
      width: 100%;
    }

    .cardImage {
      float: left;
      width: 100%;
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
    
    .dbAnalysisImage {
      width: 33.333%;
      height: auto;
      float: left;
    }
  `]
})
export class DBAnalysisComponent {

}
