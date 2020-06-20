import {Component} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "header",
  templateUrl: 'header.component.html'
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
