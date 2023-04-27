import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(public app: AppService) { }
}

// generate random dummy data for demo
//    - 50 skills, each with a weight (0-1), connecting with each with a weight (0-1)
//    - each county value for these skills (possibly zero for some of them)
//    - sum county to assign a value for state for each skill
// add two level zoom (state, county) by left/right click
// when clicking on a skill in the network, highlight states/counties on the us-map
// when clicking on a county, state in the us map, highlight skills in the network
// select upto 4-5 county for comparison. 
//    - for each selected county, state, visualize the skills network
//    - clicking on one of these skills should show the embeddedness in the selected county, states
//    - embeddedness means how that skills is connected to other top 10 skills 
//    - provide tooltip for the skills in the networks and radial 
