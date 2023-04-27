import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { AppService } from '../app.service';

@Component({
  selector: 'app-city-radial-score',
  templateUrl: './city-radial-score.component.html',
  styleUrls: ['./city-radial-score.component.less']
})
export class CityRadialScoreComponent implements OnInit {
  @Input('area') area: any;
  @ViewChild('container', { static: true }) container: ElementRef = null as any;

  constructor(public app: AppService) { }

  async ngOnInit() {
    this.prepare();
  }

  async prepare() {
    const radius = 240;
    const center = radius / 2;
    const distance = radius / 3;

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, radius, radius])
      .attr('height', '100%')
      .attr('width', '100%');

    const occupations = this.app.areaOccupationEmbds[this.area.id];
    const top10LinkedOccupations = Object.keys(occupations)
      .filter(occupation => occupation != this.app.selectedOccupation.id && occupations[occupation] > 0)
      .slice(0, 10);

    const conns: { [id: string]: any } = {};
    this.app.links.forEach(link => {
      conns[`${link.source}--${link.target}`] = 0;
      conns[`${link.target}--${link.source}`] = 0;
    });

    const nodes = top10LinkedOccupations.map((occupation, i) => ({
      id: occupation,
      x: center + distance * Math.cos(2 * Math.PI * i / 10),
      y: center + distance * Math.sin(2 * Math.PI * i / 10),
      r: 5 + occupations[occupation] * 5,
      fill: "gray",
    }));

    const links = nodes.filter(link => Math.random() > 0.5);

    const central = {
      id: this.app.selectedOccupation.id,
      x: center,
      y: center,
      r: 10,
      fill: links.length > 5 ? 'green' : links.length > 2 ? 'orange' : 'red',
    };

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

    const svgNodes = svg.selectAll("circle")
      .data([...nodes, central])
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .attr("fill", d => d.fill);

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background-color', 'lightgray')
      .style('padding', '10px')
      .style('border-radius', '10px')
      .style('font-size', '0.85rem')
      .style('pointer-events', 'none');

    svgNodes.on('mouseover', (event, d: any) => {
      tooltip.transition().duration(200).style('opacity', 1);
      const occupation = this.app.occupations[d.id];
      tooltip.html(`
          <div style="max-width: 320px;">
            <div><b>${occupation.title}</b></div>
            <hr style="margin: 0.25rem 0;"/>
            <div style="line-height: 1rem">
              <small>${occupation.description}</small>
            </div>
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }).on('mouseout', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0);
    });

    this.container.nativeElement.append(svg.node());
  }
}
