/**
 * The landing page for the app, which tells the user what the app does, what the purpose of the appis, and why
 */
import {Component} from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import {Router} from "@angular/router";

@Component({
  selector: "landing-page",
  template: `
    <div class="parallax">
      <!--<div id="group1" class="parallax__group">-->
      <!--<div class="parallax__layer parallax__layer&#45;&#45;base">-->
      <!--<div class="title">Base Layer</div>-->
      <!--</div>-->
      <!--</div>-->
      <div id="group2" class="parallax__group">
        <div class="parallax__layer parallax__layer--base">
          <div class="centeredContent">
            <div class="darkPanel">
              <h1 class="thinFont1" style="color: white; font-size: 100px;">SMART-CO</h1>
            </div>
            <div class="lightPanel">
              <p class="thinFont2" style="color: black; font-size: 30px;">A SMART EHR Module for Clinical
                Oncologists</p>
            </div>
          </div>
        </div>
        <div class="parallax__layer parallax__layer--back">
          <div class="imagePanel">
            <img src="/assets/ehr-background.png">
          </div>
        </div>
      </div>
      <div id="group3" class="parallax__group">
        <div class="parallax__layer parallax__layer--fore">
          <div class="centeredContent">
            <div class="lightPanel">
              <h1 class="thinFont1" style="color: black; font-size: 100px;">Why SMART-CO?</h1>
              <br>
              <div
                style="display: flex; justify-content: center; align-items: center; width: 80%; margin-left: 10%; margin-right: 10%;">
                <img src="/assets/smart-icon.png" style="float: left; width: 36%; height: auto; margin: 1%">
                <img src="/assets/angular-icon.svg" style="float: left; width: 18%; height: auto; margin: 1%;">
                <img src="/assets/fhir-icon.png" style="float: left; width: 40%; height: auto; margin: 1%;">
              </div>
              <br>
              <p class="thinFont1" style="color: black; font-size: 30px;">In the modern world of oncology,
                interoperability and ease-of-use is key. Why settle for less?</p>
            </div>
          </div>
        </div>
        <div class="parallax__layer parallax__layer--base">
          <div class="imagePanel">
            <img src="/assets/doctor-tablet.jpg" style="width: 100%; height: auto;">
          </div>
        </div>
      </div>
      <div id="group4" class="parallax__group">
        <div class="parallax__layer parallax__layer--base">
          <div class="centeredContent">
            <div class="darkPanel">
              <h1 class="thinFont1" style="color: white; font-size: 80px;">Key Features</h1>
              <ul class="thinFont2" style="color: white; font-size: 30px; padding: 30px;">
                <li>Intelligently query for genes and variants from 8 different genomic databases.</li>
                <li>Extensive analysis provided for genes, variants, drugs, and clinical trials.</li>
                <li>Link to any SMART-enabled EHR which provides a patient context.</li>
                <li>Easily add and remove variants linked to the patient resource.</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="parallax__layer parallax__layer--back">
          <div class="imagePanel" style="width: 45%; float: right;">
            <img src="/assets/ehr-user.png">
          </div>
        </div>
        <div class="parallax__layer parallax__layer--deep">
          <div class="imagePanel" style="width: 55%; background-color: white;">
            <img src="/assets/example-usage.png">
          </div>
        </div>
      </div>
      <!--<div id="group5" class="parallax__group">-->
      <!--<div class="parallax__layer parallax__layer&#45;&#45;fore">-->
      <!--<div class="centeredContent">Foreground Layer</div>-->
      <!--</div>-->
      <!--<div class="parallax__layer parallax__layer&#45;&#45;base">-->
      <!--<div class="centeredContent">Base Layer</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div id="group6" class="parallax__group">-->
        <!--<div class="parallax__layer parallax__layer&#45;&#45;back">-->
          <!--<div class="imagePanel">-->
            <!--<img src="/assets/open-smartco.jpg">-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="parallax__layer parallax__layer&#45;&#45;base">-->
          <!--<div class="centeredContent">-->
            <!--<a href="https://smart-co.github.io/variant-entry-and-visualization" class="thinFont1" style="font-size: 80px;">Try It Now!</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div id="group7" class="parallax__group">
        <div class="parallax__layer parallax__layer--base">
          <div class="centeredContent">
            <div class="lightPanel">
              <a href="javascript:void(0)" (click)="navigateToVisualization()" class="thinFont1" style="font-size: 80px; color: black;">Try It Now!</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::-webkit-scrollbar {
      display: none;
    }

    /* Parallax base styles
    --------------------------------------------- */

    .parallax {
      height: 500px; /* fallback for older browsers */
      height: 100vh;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-perspective: 300px;
      perspective: 300px;
    }

    .parallax__group {
      position: relative;
      height: 500px; /* fallback for older browsers */
      height: 100vh;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
    }

    .parallax__layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .parallax__layer--fore {
      -webkit-transform: translateZ(90px) scale(.7);
      transform: translateZ(90px) scale(.7);
      z-index: 1;
    }

    .parallax__layer--base {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      z-index: 4;
    }

    .parallax__layer--back {
      -webkit-transform: translateZ(-300px) scale(2);
      transform: translateZ(-300px) scale(2);
      z-index: 3;
    }

    .parallax__layer--deep {
      -webkit-transform: translateZ(-600px) scale(3);
      transform: translateZ(-600px) scale(3);
      z-index: 2;
    }

    /* demo styles
 --------------------------------------------- */

    body, html {
      overflow: hidden;
    }

    body {
      font: 100% / 1.5 Arial;
    }

    * {
      margin: 0;
      padding: 0;
    }

    .parallax {
      font-size: 200%;
    }

    /* centre the content in the parallax layers */
    .centeredContent {
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 100%;
    }

    /* style the groups
    --------------------------------------------- */

    /*#group1 {*/
    /*z-index: 5; !* slide over group 2 *!*/
    /*}*/

    /*#group1 .parallax__layer--base {*/
    /*background: rgb(102, 204, 102);*/
    /*}*/

    #group2 {
      z-index: 3; /* slide under groups 1 and 3 */
    }

    #group2 .parallax__layer--back {
      background: rgb(123, 210, 102);
    }

    #group3 {
      z-index: 4; /* slide over group 2 and 4 */
    }

    #group3 .parallax__layer--base {
      background: rgb(153, 216, 101);
    }

    #group4 {
      z-index: 2; /* slide under group 3 and 5 */
    }

    #group4 .parallax__layer--deep {
      background: rgb(184, 223, 101);
    }

    #group5 {
      z-index: 3; /* slide over group 4 and 6 */
    }

    #group5 .parallax__layer--base {
      background: rgb(214, 229, 100);
    }

    #group6 {
      z-index: 2; /* slide under group 5 and 7 */
    }

    #group6 .parallax__layer--back {
      background: rgb(245, 235, 100);
    }

    #group7 {
      z-index: 3; /* slide over group 7 */
    }

    #group7 .parallax__layer--base {
      background: #33ec4a url("/assets/open-smartco.jpg");
      background-size: 100% auto;
    }

    /* Custom classes */
    .darkPanel {
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 20px;
      padding: 30px;
      width: 80%;
      margin-left: 10%;
      margin-right: 10%;
    }

    .lightPanel {
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 30px;
      width: 80%;
      margin-left: 10%;
      margin-right: 10%;
    }

    .imagePanel {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: white;
    }

    .imagePanel > img {
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
    this.router.navigate(["/variant-entry-and-visualization"]);
  }
}
