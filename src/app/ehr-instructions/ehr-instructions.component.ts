import {Component} from "@angular/core";

@Component({
  selector: "ehr-instructions",
  template: `
    <div id="wrapper">
      <h2 class="display-2" style="text-align: center;">EHR Link Example</h2>
      <br>
      <div class="instructionBlock">
        <h4 class="display-4 instructionHeading">Linking the app to the sandbox</h4>
        <p class="thinFont1">Navigate to <a href="https://sandbox.hspconsortium.org">the HSPC Sandbox</a>, and create a new account.</p>
        <img style="width: 100%" src="/assets/create-account.png">
        <br>
        <p class="thinFont1">Then, you will have to create a new sandbox.  Do so with the FHIR STU3 specification.</p>
        <p class="thinFont1">Following the sandbox creation, navigate to the "Registered Apps" section and click "Register new app manually".  Enter the following parameters: </p>
        <img style="width: 70%" src="/assets/registering-app.png">
      </div>
      <br>
      
      <div class="instructionBlock">
        <h4 class="display-4 instructionHeading">Building a launch scenario</h4>
        <p class="thinFont1">With your new registered app, create a new Practitioner Persona.  Then, create a new launch scenario for the app with any patient and practitioner persona you desire.</p>
        <p style="color: red">(NOTE: Ensure that you link the launch scenario to the SMART-CO app registration you created in the previous step).  </p>
        <img style="width: 40%" src="/assets/launching-scenario.png">
      </div>
      <br>
      
      <div class="instructionBlock">
        <h4 class="display-4 instructionHeading">Launching the application</h4>
        <p class="thinFont1">First, take note of the Client ID for the application.  This long string is required for the application to access the sandbox data.</p>
        <img style="width: 40%" src="/assets/getting-client-id.png">
        <br>
        <p class="thinFont1">Now, click "Launch" on your launch scenario.  Upon beginning the app, you should be prompted for your client ID.  Paste in the one you obtained prior.</p>
        <img style="width: 80%" src="/assets/entering-info.png">
        <br>
        <p>Congrats, you're done!</p>
      </div>
    </div>
  `,
  styles: [`
    #wrapper {
      padding: 5px;
    }
    
    .instructionBlock {
      border: 1px solid grey;
      border-radius: 15px;
      padding: 10px;
      text-align: center;
    }
    
    .instructionHeading {
      text-align: center;
    }
    
    .instructionBlock p {
      font-size: 20px;
    }
  `]
})
export class EHRInstructionsComponent {

}
