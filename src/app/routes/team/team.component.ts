import {Component} from "@angular/core";

@Component({
  selector: "team",
  template: `
    <div id="makiah">
      <div class="profileImage" style="background-image: url('/assets/team/makiah.jpg'); background-size: auto 100%; background-position: center;"></div>

      <div class="profileContent">
        <h1 class="thinFont2">Makiah Bennett</h1>
        <hr>
        <p class="thinFont2">Available at <a href="mailto:makiahtbennett@gmail.com">makiahtbennett@gmail.com</a>.</p>
      </div>
    </div>
    
    <div id="ishaan">
      <div class="profileContent">
        <h1 class="thinFont2">Ishaan Prasad</h1>
        <hr>
        <p class="thinFont2">Available at <a href="mailto:prasadis@belmonthill.org">prasadis@belmonthill.org</a>.</p>
      </div>
      
      <div class="profileImage" style="background-image: url('/assets/team/ishaan.jpg'); background-size: auto 100%; background-position: center;">
      </div>
    </div>
    
    <div id="otherContributors">
      <div style="padding: 10px 15px;">
        <h1 class="thinFont2">Additional Credits</h1>
        <hr>
        <ul class="thinFont2" style="font-size: 20px;">
          <li>Dr. Gil Alterovitz</li>
          <li>Dr. Jeremy Warner</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    #makiah, #ishaan, #otherContributors {
      background-color: white;
      margin: 5px;
      height: 200px;
      width: calc(100% - 10px);
      overflow: hidden;
      border: 1px solid #e1e1e1;
    }

    #makiah {
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
    }

    #ishaan {
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
    }

    .profileImage, .profileContent {
      margin: 5px;
      height: calc(100% - 10px);
      overflow: hidden;
      float: left;
    }

    .profileImage {
      border-radius: 100px;
      width: 190px;
      background-color: grey;
    }

    .profileContent {
      width: calc(100% - 210px);
      padding: 10px;
      font-size: 20px;
    }
  `]
})
export class TeamComponent {

}
