import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.less']
})
export class USMapComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef = null as any;

  constructor(public app: AppService) { }

  async ngOnInit() {
    this.app.prepareUSMap = this.prepare.bind(this);
    this.app.prepareUSMap();
  }

  async prepare(filter?: string[]) {
    this.container.nativeElement.replaceChildren();

    const cbsa = this.app.cbsa;
    const counties = this.app.counties;

    const width = 640, height = 480;
    const svg = d3.create('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('height', '100%')
      .attr('width', '100%');
    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(850);
    const path: any = d3.geoPath().projection(projection);

    // areas
    const areas = svg.append('g')
      .selectAll('path')
      .data((topojson.feature(cbsa, cbsa.objects.areas) as any).features)
      .enter().append('path').attr('d', path)
      .attr('fill', (d: any) => 'steelblue')
      .style('opacity', (d: any) => Math.max(0, Math.min(1, this.app.areaEmbds[d.properties.GEOID] * (!filter || filter.indexOf(d.properties.GEOID) >= 0 ? 1.5 : 0.15))))
      .attr('stroke-width', 0)
      .style('cursor', 'pointer');

    // states
    const states = svg.append('g')
      .selectAll('path')
      .data((topojson.feature(counties, counties.objects.states) as any).features)
      .enter().append('path').attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke', 'darkblue')
      .attr('stroke-width', 0.25)
      .style('pointer-events', 'none');

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background-color', 'lightgray')
      .style('padding', '5px 10px')
      .style('border-radius', '10px')
      .style('font-size', '0.85rem')
      .style('pointer-events', 'none');

    areas.on('mouseover', (event, d: any) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      const occupations = this.app.getTopNOccupations(d.properties.GEOID, 10);
      tooltip.html(`
          <div style="max-width: 320px;">
            <div><b>${d.properties.NAME}</b></div>
            <hr style="margin: 0.25rem 0;"/>
            <div style="line-height: 1rem;">
              <b style="font-size: 0.65rem;">Top Occupations: </b>
              <small>${occupations.map(occupation => this.app.occupations[occupation].title).join(', ')}</small>
            </div>
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }).on('mouseout', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0);
    }).on('click', (event, d: any) => {
      console.log(event.shiftKey);
      if (event.shiftKey) {
        if (this.app.selectedAreas.indexOf(d.properties.GEOID) < 0 && this.app.selectedAreas.length < 3) {
          this.app.selectedAreas.push(this.app.areas[d.properties.GEOID]);
          this.app.reloadComparisons();
        }
      } else {
        tooltip.transition().duration(200).style('opacity', 0);
        this.app.setSelectedArea(this.app.areas[d.properties.GEOID]);
      }
    });

    this.container.nativeElement.append(svg.node());
  }
}
