import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCreatorComponent } from './blog-creator.component';

describe('BlogCreatorComponent', () => {
  let component: BlogCreatorComponent;
  let fixture: ComponentFixture<BlogCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
