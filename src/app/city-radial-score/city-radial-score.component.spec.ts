import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityRadialScoreComponent } from './city-radial-score.component';

describe('CityRadialScoreComponent', () => {
  let component: CityRadialScoreComponent;
  let fixture: ComponentFixture<CityRadialScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityRadialScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityRadialScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
