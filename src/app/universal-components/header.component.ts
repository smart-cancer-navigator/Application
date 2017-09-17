import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "header",
  template: `    
    <div id="greyBackground"></div>
    
    <div id="container">
      <img src="/assets/entry-and-visualization/app-logo.png">
      
      <div id="routingOptions">
        <div class="routeOption" (click)="routeTo('home')">
          <p>Home</p>
        </div>
        <div class="routeOption">
          <p>About</p>
        </div>
        <div class="routeOption">
          <p>Team</p>
        </div>
        <div class="routeOption">
          <p>News</p>
        </div>
        <div class="routeOption">
          <p>Contact</p>
        </div>
        <div style="width: 6px; height: 76px; float: left; border-left: 1px solid #b8b8b8; margin-top: 2px; margin-bottom: 2px;">
        </div>
        <div class="routeOption" (click)="routeTo('app');">
          <p>Try It Out!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #greyBackground {
      width: 100vw;
      height: 100vh;
      background-color: #eeeeee;
      position: fixed;
      z-index: -50;
    }

    #container {
      background-color: white;
      width: 100%;

      padding-left: 30px;

      box-shadow: 0 2px 4px #b4b4b4;

      overflow: hidden;
    }

    #container img {
      height: 40px;
      width: auto;
      margin-top: 20px;
      margin-bottom: 20px;
      float: left;
    }

    #routingOptions {
      min-width: 600px;
      height: 100%;
      overflow: hidden;
      float: right;
    }

    .routeOption {
      float: left;
      color: #2f2f2f;

      background-color: white;
      text-align: center;
      height: 60px;
      width: calc(100% / 6 - 7px); /* +1 px for each for border div */
      margin: 10px 3px;

      display: flex;
      justify-content: center;
      align-items: center;

      cursor: default;
      border-radius: 5px;
    }

    .routeOption:hover {
      background-color: #dbdbdb;
    }

    .routeOption:active {
      background-color: #cbcbcb;
    }
  `]
})
export class HeaderComponent {
  constructor (private router: Router) {}

  routeTo(routeLoc: string) {
    this.router.navigate([routeLoc]);
  }
}
