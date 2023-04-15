import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-job-network',
  templateUrl: './job-network.component.html',
  styleUrls: ['./job-network.component.less']
})
export class JobNetworkComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef = null as any;

  async ngOnInit() {
    const data: any = await d3.json('/assets/network.json');
    const width = 400, height = 550 /*400*/;
    this.container.nativeElement.append(await this.network(data, width, height));
  }

  async network(
    links: [{ source: string, target: string, type: string }],
    width: number, height: number
  ) {
    const map: any = {};
    links.forEach(l => {
      map[l.source] = l.type;
      map[l.target] = l.type;
    });
    const nodes: any = Array.from(new Set([
      ...links.map(d => d.source),
      ...links.map(d => d.target)
    ])).map(link => ({ id: link }));
    const types = Array.from(new Set(links.map(d => d.type)));
    const color = d3.scaleOrdinal(types, ['#ffc109', '#b44a9f']);

    // console.log(color('physical'));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-40))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

    // -- per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
      .data(types)
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    // -- links
    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 0.25)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", d => color(d.type));

    // -- nodes
    const node = svg.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(((simulation: any): any => {
        function dragged(event: any, d: any) { d.fx = event.x; d.fy = event.y; }
        function dragended(event: any, d: any) { if (!event.active) { simulation.alphaTarget(0); } d.fx = null; d.fy = null; }
        function dragstarted(event: any, d: any) { if (!event.active) { simulation.alphaTarget(0.3).restart(); } d.fx = d.x; d.fy = d.y; }
        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
      })(simulation))
      .append("circle")
      .attr("stroke-width", 0)
      .attr("fill", (d: any) => color(map[d.id]))
      .attr("r", (d) => 4 + Math.random() * 4);

    // // -- node labels
    // node.append("text")
    //   .attr("x", 8)
    //   .attr("y", "0.31em")
    //   .text((d: any) => d.id)
    //   .clone(true).lower()
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("stroke-width", 3);

    simulation.on("tick", () => {
      link.attr("d", (d: any) => `M${d.source.x},${d.source.y} A0,0 0 0,1 ${d.target.x},${d.target.y}`);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // invalidation.then(() => simulation.stop());

    svg.selectAll('legend-circles')
      .data(types).enter().append("circle")
      .attr("cx", -width / 2 + 10)
      .attr("cy", (d) => -height / 2 + 10 + types.indexOf(d) * 18)
      .attr("r", 5)
      .style("fill", d => color(d));

    svg.selectAll('legend-labels')
      .data(types).enter().append("text")
      .attr("x", 2 - width / 2 + 20)
      .attr("y", (d) => -height / 2 + 12 + types.indexOf(d) * 18)
      .text((d) => `${d.substring(0, 1).toUpperCase()}${d.substring(1)}`)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    return svg.node();
  }
}
