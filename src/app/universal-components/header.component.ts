import {Component} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "header",
  template: `
    <div id="greyBackground"></div>

    <div id="container">
      <img src="/assets/logo.svg">
      <button (click)="logout()">Logout</button>
      <div id="routingOptions">
        <div class="routeOption {{currentRoute === '/home' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('home')">
          <p>Home</p>
        </div>
        <div class="routeOption {{currentRoute === '/team' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('team')">
          <p>Team</p>
        </div>
        <div class="routeOption {{currentRoute === '/ehr-link' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('ehr-link')">
          <p>EHR Link</p>
        </div>
        <div class="routeOption {{currentRoute === '/db-analysis' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('db-analysis')">
          <p>DB Analysis</p>
        </div>
        <div style="width: 1px; height: 76px; float: left; background-color: #a4a4a4; margin: 2px 3px;">
        </div>
        <div class="routeOption {{currentRoute === '/app' ? 'selectedRoute' : 'unselectedRoute'}}"
             (click)="routeTo('app');">
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
      min-width: 500px;
      height: 100%;
      overflow: hidden;
      float: right;
    }

    .routeOption {
      float: left;
      color: #2f2f2f;

      text-align: center;
      height: 60px;
      width: calc(100% / 5 - 8px); /* +1 px for each for border div */
      margin: 10px 3px;

      display: flex;
      justify-content: center;
      align-items: center;

      cursor: default;
      border-radius: 5px;
    }

    .unselectedRoute {
      background-color: white;
    }

    .unselectedRoute:hover {
      background-color: #dbdbdb;
    }

    .unselectedRoute:active {
      background-color: #cbcbcb;
    }

    .selectedRoute {
      background-color: #27384f;
      color: white;
    }
  `]
})
export class HeaderComponent {
  constructor (private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.urlAfterRedirects;
      }
    });
  }

  currentRoute: string = "/app";

  routeTo(routeLoc: string) {
    this.router.navigate([routeLoc]);
  }

  logout() {
    localStorage.clear();
    location.reload();
  }
}
