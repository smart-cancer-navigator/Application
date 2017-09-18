import {Component} from "@angular/core";

@Component({
  selector: "github-fork-us",
  template: `
    <div>
      <a href="https://www.github.com/smart-cancer-navigator/Application">
        <img src="/assets/github-icon.png">
      </a>
    </div>
  `,
  styles: [`
    div {
      display: block;
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 50;
      background-color: black;
      border-radius: 25px;
    }
    
    * {
      height: 50px;
      width: 50px;
    }
  `]
})
export class GithubForkUsComponent {
}
