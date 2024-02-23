import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
      logOut: jest.fn(),
    }
  };

  const mockUserService = {
    getById: jest.fn(() => of("user")),
    delete: jest.fn(() => of("user")),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user', () => {
    
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalled();
  });

  it('should delete a user', () => {
    const userServiceSpy = jest.spyOn(mockUserService, 'delete');
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalled();
  });
});
