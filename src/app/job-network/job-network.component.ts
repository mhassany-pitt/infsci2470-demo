import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-job-network',
  templateUrl: './job-network.component.html',
  styleUrls: ['./job-network.component.less']
})
export class JobNetworkComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef = null as any;
  legendTypes: string[] = null as any;
  legendColorNames: { [color: string]: string } = null as any;

  search = false;
  searchKey = "";
  filtered: { id: string, title: string }[] = [];
  filter($event: any) {
    this.filtered = this.searchKey.length >= 3
      ? Object.values(this.app.occupations).filter(area => area.title.toLowerCase().indexOf(this.searchKey) >= 0)
      : [];
  }

  constructor(public app: AppService) { }

  async ngOnInit() {
    this.app.prepareJobNetwork = this.prepare.bind(this);
    this.app.prepareJobNetwork();
  }

  async prepare(filter?: string[]) {
    this.container.nativeElement.replaceChildren();

    this.legendTypes = this.app.occupationTypes;

    const links = this.app.links.map(link => {
      // create a true copy
      const { source, target, type } = link;
      return { source, target, type };
    });

    const typesMap: any = {};
    links.forEach(l => {
      typesMap[l.source] = l.type;
      typesMap[l.target] = l.type;
    });
    const nodes: any = Array.from(new Set([
      ...links.map(d => d.source),
      ...links.map(d => d.target)
    ])).map(link => ({ id: link }));

    const types = this.app.occupationTypes;
    const color = d3.scaleOrdinal(types, ['#ffa500', '#b44a9f']);
    this.legendColorNames = types.reduce((o, c) => {
      o[c] = color(c);
      return o;
    }, {} as any);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-40))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const width = 640, height = 480;
    const svg = d3.create('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('height', '100%')
      .attr('width', '100%');

    // -- per-type markers, as they don't inherit styles.
    svg.append('defs')
      .selectAll('marker')
      .data(types)
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -0.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', color)
      .attr('d', 'M0,-5L10,0L0,5');

    // -- links
    const svgLinks = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 0.25)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', d => color(d.type));

    // -- nodes
    const svgNodes = svg.append('g')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(((simulation: any): any => {
        function dragged(event: any, d: any) { d.fx = event.x; d.fy = event.y; }
        function dragended(event: any, d: any) { if (!event.active) { simulation.alphaTarget(0); } d.fx = null; d.fy = null; }
        function dragstarted(event: any, d: any) { if (!event.active) { simulation.alphaTarget(0.3).restart(); } d.fx = d.x; d.fy = d.y; }
        return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
      })(simulation))
      .append('circle')
      .attr('data-node', (d: any) => d.id)
      .attr('stroke-width', 0)
      .attr('fill', (d: any) => color(typesMap[d.id]))
      .style('opacity', (d: any) => Math.max(0, Math.min(1, !filter || filter.indexOf(d.id) >= 0 ? 1 : .15)))
      .attr('r', (d: any) => 5 + this.app.occupationEmbds[d.id])
      .style('cursor', 'pointer');

    simulation.on('tick', () => {
      svgLinks.attr('d', (d: any) => `M${d.source.x},${d.source.y} A0,0 0 0,1 ${d.target.x},${d.target.y}`);
      svgNodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

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
    }).on('click', (event, d: any) => {
      tooltip.transition().duration(200).style('opacity', 0);
      this.select(d.id);
    });

    this.container.nativeElement.append(svg.node());
  }

  select(id: string) {
    this.app.setSelectedOccupation(this.app.occupations[id]);
    this.app.reloadComparisons();
  }
}
