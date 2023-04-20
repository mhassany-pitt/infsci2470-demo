import { Component } from '@angular/core';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less']
})
export class CompareComponent {
  cities = [
    { label: 'Pittsburgh, PA (2019)', embeddedness: 'High', color: 'green' },
    { label: 'Manhatan, NY (2020)', embeddedness: 'Medium', color: 'darkorange' },
    { label: 'Silicon Valley, CA (2018)', embeddedness: 'Low', color: 'red' },
  ]
}
