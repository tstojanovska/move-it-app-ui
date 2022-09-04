import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from './customValidators';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { IUser } from './register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //Form Validables
  registerForm: any = FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  //Add user form actions
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    //True if all the fields are filled
    if (this.submitted) {
      let formObj = this.registerForm.getRawValue();
      let serializedForm = JSON.stringify(formObj);

      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }

      this.http
        .post<IUser>('http://localhost:5124/api/Users/register', serializedForm, httpOptions)
        .subscribe({
          next: (response) => {
            this.toastr.success("User created!")
            this.router.navigate(['login'])
          },
          error: (error) => {
            this.toastr.error(error.error)
          },
        });
    }
  }

  ngOnInit() {
    //Add User form validations
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmedPassword: ['', [Validators.required]]
    },
      {
        validators: CustomValidators.mustMatch('password', 'confirmedPassword')
      });
  }
}
