import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { ActivatedRoute, Router} from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent unit test', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionData : Session
  let mockSessionService : any
  let mockSessionApiService : any
  let mockRoute : any
  let mockRouter : any

  beforeEach(() => {
    sessionData =  {
      name: "test",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: [1],
    }
    mockSessionService = {
      sessionInformation: {
        admin: true
      }
    } 
    mockSessionApiService = {
      detail : jest.fn(() => of<Session>(sessionData)),
      create : jest.fn(() => of<Session>(sessionData)),
      update : jest.fn(() => of<Session>(sessionData)),
    } 
    mockRoute = {
      snapshot : {
        paramMap : {
          get : jest.fn()
        }
      }
    }
    mockRouter = {
      navigate : jest.fn(),
      url : "/"
    }
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
      declarations: [FormComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {jest.resetAllMocks()});


  it('should create', () => {expect(component).toBeTruthy()});

  it('should redirect in /session on ngOnInit function',  () => {
    let routerMock = jest.spyOn(mockRouter, 'navigate').mockReturnValue(Promise.resolve(true));
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();
    component.ngOnInit();
    expect(routerMock).toHaveBeenCalled();
  });

  it('should pass onUpdate false to true', async() => {
    const sessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of<Session>(sessionData));
    mockSessionService.sessionInformation.admin = true;
    mockRouter.url = "/update";
    fixture.detectChanges()
    component.ngOnInit();
    expect(sessionApiServiceSpy).toHaveBeenCalled();
    expect(component.onUpdate).toBeTruthy();
  });

  it('should initialize session Form', async () => {
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.onUpdate).toBeFalsy();
  });

  it('should create a session', async () => {
    const sessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of<Session>(sessionData));
    fixture.detectChanges();
    component.submit();
    expect(sessionApiServiceSpy).toHaveBeenCalled();
  });

  it('should update a session', async () => {
    component.onUpdate = true;
    const sessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'update').mockReturnValue(of<Session>(sessionData));
    fixture.detectChanges();
    component.submit();
    expect(sessionApiServiceSpy).toHaveBeenCalled();
  });
});
