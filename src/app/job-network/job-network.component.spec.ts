import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNetworkComponent } from './job-network.component';

describe('JobNetworkComponent', () => {
  let component: JobNetworkComponent;
  let fixture: ComponentFixture<JobNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobNetworkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
