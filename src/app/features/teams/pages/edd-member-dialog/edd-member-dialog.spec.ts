import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EddMemberDialog } from './edd-member-dialog';

describe('EddMemberDialog', () => {
  let component: EddMemberDialog;
  let fixture: ComponentFixture<EddMemberDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EddMemberDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EddMemberDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
