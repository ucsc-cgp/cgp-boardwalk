import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCAlertDialogComponent } from './cc-alert-dialog.component';

describe('CCAlertDialogComponent', () => {
  let component: CCAlertDialogComponent;
  let fixture: ComponentFixture<CCAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
