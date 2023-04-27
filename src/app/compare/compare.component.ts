import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less']
})
export class CompareComponent {
  constructor(public app: AppService) { }

  get selectedAreaNames() {
    return this.app.selectedAreas.length ? this.app.selectedAreas.map(a => a.name).join(', ') : 'no area';
  }

  removeSelectedArea(area: any) {
    const index = this.app.selectedAreas.indexOf(area);
    if (index >= 0) {
      this.app.selectedAreas.splice(index, 1);
    }
  }
}
