import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-city-radial-score',
  templateUrl: './city-radial-score.component.html',
  styleUrls: ['./city-radial-score.component.less']
})
export class CityRadialScoreComponent implements OnInit {
  @Input() color = 'green';

  @ViewChild('container', { static: true }) container: ElementRef = null as any;

  async ngOnInit() {
    this.container.nativeElement.append(await this.map());
  }

  async map() {
    const radius = 240;
    const center = radius / 2;
    const distance = radius / 3;

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, radius, radius])
      .attr('height', '100%')
      .attr('width', '100%');

    const central = {
      x: center,
      y: center,
      r: 10,
      fill: this.color
    };

    const outers = d3.range(10).map((d, i) => ({
      x: center + distance * Math.cos(2 * Math.PI * i / 10),
      y: center + distance * Math.sin(2 * Math.PI * i / 10),
      r: 5 + Math.random() * 10,
      fill: "gray",
    }));
    const links = outers.filter(o => Math.random() > .5);

    svg.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => central.x)
      .attr("y1", d => central.y)
      .attr("x2", d => d.x)
      .attr("y2", d => d.y)
      .attr("stroke", d => d.fill)
      .attr("stroke-width", d => d.r / 2);

    svg.selectAll("circle")
      .data([...outers, central])
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .attr("fill", d => d.fill);

    return svg.node();
  }
}
