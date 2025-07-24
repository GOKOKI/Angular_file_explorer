import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileForm } from './file-form';

describe('FileForm', () => {
  let component: FileForm;
  let fixture: ComponentFixture<FileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
