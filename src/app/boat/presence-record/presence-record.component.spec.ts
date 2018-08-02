import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceRecordComponent } from './presence-record.component';

describe('PresenceRecordComponent', () => {
  let component: PresenceRecordComponent;
  let fixture: ComponentFixture<PresenceRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresenceRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
