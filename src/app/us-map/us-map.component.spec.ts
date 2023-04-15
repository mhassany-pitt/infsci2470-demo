import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USMapComponent } from './us-map.component';

describe('USMapComponent', () => {
  let component: USMapComponent;
  let fixture: ComponentFixture<USMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ USMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(USMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
