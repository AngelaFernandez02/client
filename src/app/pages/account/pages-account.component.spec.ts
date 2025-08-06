import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesAccountComponent } from './pages-account.component';

describe('PagesAccountComponent', () => {
  let component: PagesAccountComponent;
  let fixture: ComponentFixture<PagesAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagesAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
