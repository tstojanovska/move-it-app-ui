import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ISuccessfulLogin } from './login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Form Validables
  loginForm: any = FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private toastr: ToastrService,  private router: Router) { }
  //Add user form actions
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    //True if all the fields are filled
    if (this.submitted) {
      let formObj = this.loginForm.getRawValue();
      let serializedForm = JSON.stringify(formObj);

      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }

      this.http
        .post<ISuccessfulLogin>('http://localhost:5124/api/Users/login', serializedForm, httpOptions)
        .subscribe({
          next: (response) => {
            localStorage.setItem("token", response.token);
            localStorage.setItem("fullName", ''.concat(response.firstName, ' ', response.lastName));
            this.router.navigate(['proposal-list'])
          },
          error: (error) => this.toastr.error(error.error),
        });
    }
  }

  ngOnInit() {
    //Add User form validations
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

}
