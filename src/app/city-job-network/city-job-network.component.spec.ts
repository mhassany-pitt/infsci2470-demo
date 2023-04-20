import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityJobNetworkComponent } from './city-job-network.component';

describe('CityJobNetworkComponent', () => {
  let component: CityJobNetworkComponent;
  let fixture: ComponentFixture<CityJobNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityJobNetworkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityJobNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
