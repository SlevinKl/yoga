import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent ', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  mockAuthService = {register : jest.fn(data => "register")};
  afterEach(() => {jest.restoreAllMocks()});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers : [{provide: AuthService , useValue: mockAuthService}],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user', async() => {
    const authServiceSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(of());
    component.submit();
    expect(authServiceSpy).toHaveBeenCalled();
    expect(component.onError).toBeFalsy();
  })

  it('should throw an error when we create a user', () => {
    const authServiceSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => "error"));
    component.submit();
    expect(authServiceSpy).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  })
});
