import {Component} from "@angular/core";

@Component({
  selector: "github-fork-us",
  template: `
    <div>
      <a target="_blank" href="https://www.github.com/smart-cancer-navigator/Application">
        <img class="hvr-grow" src="/assets/github-icon.png">
      </a>
    </div>
  `,
  styles: [`
    div {
      display: block;
      position: fixed;
      right: 5px;
      bottom: 5px;
      z-index: 50;
      //background-color: black;
      border-radius: 25px;
    }
    
    * {
      height: 60px;
      width: 60px;
    }

    .hvr-grow {
      display: inline-block;
      vertical-align: middle;
      transform: translateZ(0);
      box-shadow: 0 0 1px rgba(0, 0, 0, 0);
      backface-visibility: hidden;
      -moz-osx-font-smoothing: grayscale;
      transition-duration: 0.3s;
      transition-property: transform;
    }

    .hvr-grow:hover, .hvr-grow:focus, hvr-grow:active {
      transform: scale(1.1);
    }

  `]
})
export class GithubForkUsComponent {
}
