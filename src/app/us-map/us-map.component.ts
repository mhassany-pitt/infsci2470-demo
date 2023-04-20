import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.less']
})
export class USMapComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef = null as any;

  async ngOnInit() {
    const data = await d3.json('/assets/us-counties-10m.json')
    this.container.nativeElement.append(await this.map(data));
  }

  async map(us: any) {
    const width = 640, height = 480;
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr('height', '100%')
      .attr('width', '100%');
    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(850);
    const path: any = d3.geoPath().projection(projection);

    // counties
    const counties = svg.append("g")
      .selectAll("path")
      .data((topojson.feature(us, us.objects.counties) as any).features)
      .enter().append("path").attr("d", path)
      .attr("fill", (d: any) => d3.interpolate("white", "steelblue")(Math.random() * 1.25))
      .attr("stroke-width", 0);

    // states
    const states = svg.append("g")
      .selectAll("path")
      .data((topojson.feature(us, us.objects.states) as any).features)
      .enter().append("path").attr("d", path)
      .attr("fill", 'transparent')
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("pointer-events", "none");

    const tooltip = d3.select("body")
      .append("div")
      .style('position', 'absolute')
      .style("opacity", 0)
      .style('background-color', 'lightgray')
      .style('padding', '5px 10px')
      .style('border-radius', '10px')
      .style('font-size', '0.85rem');

    counties.on("mouseover", (event, d: any) => {
      console.log(d);
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`County: ${d.properties.name}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }).on("mouseout", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    });

    return svg.node();
  }
}
