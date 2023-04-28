import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  ready = false;
  compare = true;

  // topojson
  cbsa: any;
  counties: any;

  // id to object
  areas: { [geoid: string]: { id: string, name: string } } = {};
  occupations: { [code: string]: { id: string, title: string, description: string, type: string } } = {};
  occupationTypes = ['Physical', 'Cognitive'];

  links: { source: string, target: string, type: string }[] = [];
  areaOccupationEmbds: { [area: string]: { [occupation: string]: number } } = {};
  occupationEmbds: { [occupation: string]: number; } = {};
  areaEmbds: { [occupation: string]: number; } = {};

  // selected values
  selectedOccupation: any;
  selectedArea: any;
  selectedAreas: any[] = [];

  prepareJobNetwork: (filter?: string[]) => void = null as any;
  prepareUSMap: (filter?: string[]) => void = null as any;

  constructor() {
    this.prepare();
  }

  async prepare() {
    await this.loadOnet();
    await this.loadCBSA();
    await this.loadCounties();

    this.calcAreaOccupationEmbeds();
    this.genRandomLinks(150);

    // TODO: default for demo
    this.selectedAreas = [this.areas['38300'], this.areas['35620'], this.areas['41940']];
    this.selectedOccupation = this.occupations['15-1252.00'];

    this.ready = true;
  }

  setSelectedOccupation(occupation: any) {
    this.selectedOccupation = occupation;
    this.prepareUSMap(occupation ? this.getOccupationAreas(occupation.id) : null as any);
  }

  setSelectedArea(area: any) {
    this.selectedArea = area;
    this.selectedAreas = [];
    this.prepareJobNetwork(area ? this.getAreaOccupations(area.id) : null as any);
  }

  private async loadCounties() {
    this.counties = await d3.json('assets/us-counties-10m.json');
  }

  private async loadCBSA() {
    this.cbsa = await d3.json('assets/tl_2015_us_cbsa.json');
    this.cbsa.objects.areas.geometries.forEach((geometry: any) =>
      this.areas[geometry.properties.GEOID] = {
        id: geometry.properties.GEOID,
        name: geometry.properties.NAME
      });
  }

  private async loadOnet() {
    (await d3.csv('assets/onet-occupations.csv'))
      .forEach((occupation: any) => this.occupations[occupation.code] = {
        id: occupation.code,
        title: occupation.title,
        description: occupation.description,
        type: Math.random() > .5 ? 'physical' : 'cognitive'
      });
  }

  private genRandomLinks(n: number) {
    const sliced = this.getTopNCommonOccupations(n);
    const randomOccupation = () => sliced[Math.floor(Math.random() * sliced.length)];

    d3.range(n * 5).forEach(i => {
      const source = randomOccupation();
      const target = randomOccupation();
      if (source != target) {
        this.links.push({
          source,
          target,
          type: [
            this.occupations[source].type,
            this.occupations[target].type
          ][Math.round(Math.random())]
        });
      }
    });
  }

  getTopNCommonOccupations(n: number) {
    const occupations = Object.keys(this.occupations);
    const sliced = occupations.map(occupation => ({ occupation, value: this.occupationEmbds[occupation] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, Math.min(occupations.length, n))
      .map(occupation => occupation.occupation);
    return sliced;
  }

  getTopNOccupations(geoid: string, n: number) {
    const geoidOccupations = this.areaOccupationEmbds[geoid];
    const occupations = Object.keys(geoidOccupations);
    const sliced = occupations.map(occupation => ({ occupation, value: geoidOccupations[occupation] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, Math.min(occupations.length, n))
      .map(occupation => occupation.occupation);
    return sliced;
  }

  private calcAreaOccupationEmbeds() {
    const occupations = Object.keys(this.occupations);
    occupations.forEach(occupation => this.occupationEmbds[occupation] = 0);

    // area->occupations->embeds
    let max0 = 0;
    Object.keys(this.areas).forEach(area => {
      this.areaEmbds[area] = 0;

      const embeddedness: { [occupation: string]: number } = {};
      this.areaOccupationEmbds[area] = embeddedness;
      occupations.forEach(occupation => {
        embeddedness[occupation] = Math.random() > .975 ? Math.random() : 0;

        this.occupationEmbds[occupation] += this.areaOccupationEmbds[area][occupation]
      });

      this.areaEmbds[area] = d3.sum(Object.values(this.areaOccupationEmbds[area]));
      max0 = Math.max(max0, this.areaEmbds[area]);
    });


    // scale to 0-1
    Object.keys(this.areas).forEach(geoid => this.areaEmbds[geoid] /= max0);

    let max1 = 0;
    occupations.forEach(occupation => max1 = Math.max(max1, this.occupationEmbds[occupation]));
    occupations.forEach(occupation => this.occupationEmbds[occupation] /= max1);
  }

  getOccupationAreas(occupation: string) {
    return Object.keys(this.areaOccupationEmbds)
      .filter(area => occupation in this.areaOccupationEmbds[area] && this.areaOccupationEmbds[area][occupation] > 0)
  }

  getAreaOccupations(area: string) {
    return Object.keys(this.areaOccupationEmbds[area])
      .filter(occupation => this.areaOccupationEmbds[area][occupation] > 0)
  }

  reloadComparisons() {
    this.compare = false;
    setTimeout(() => this.compare = true, 0);
  }
}
