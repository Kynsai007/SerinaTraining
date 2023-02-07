import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerSettingsComponent } from './trigger-settings.component';

describe('TriggerSettingsComponent', () => {
  let component: TriggerSettingsComponent;
  let fixture: ComponentFixture<TriggerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriggerSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
