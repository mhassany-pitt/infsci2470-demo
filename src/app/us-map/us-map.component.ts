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
    const width = 640, height = 400;
    this.container.nativeElement.append(await this.map(data, width, height));
  }

  async map(us: any, width: number, height: number) {
    const svg = d3.create("svg").attr("width", width).attr("height", height);

    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(850);
    const path: any = d3.geoPath().projection(projection);

    // counties
    svg.append("g")
      .selectAll("path")
      .data((topojson.feature(us, us.objects.counties) as any).features)
      .enter().append("path").attr("d", path)
      .attr("fill", (d: any) => d3.interpolate("white", "steelblue")(Math.random() * 1.25))
      .attr("stroke-width", 0);

    // states
    svg.append("g")
      .selectAll("path")
      .data((topojson.feature(us, us.objects.states) as any).features)
      .enter().append("path").attr("d", path)
      .attr("fill", 'transparent')
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("click", (d: any) => {
        // ...
      });

    return svg.node();
  }
}
