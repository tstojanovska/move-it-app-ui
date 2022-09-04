import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { MovingObjectType, IProposal } from '../proposal-list/proposal-list.model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  inquiryForm: any = FormGroup;
  submitted = false;
  movingObjectTypes: { key: number, value: string }[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  get f() { return this.inquiryForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.inquiryForm.invalid) {
      return;
    }
    //True if all the fields are filled
    if (this.submitted) {
      let formObj = this.inquiryForm.getRawValue();

      if (isNaN(Number(+formObj.movingObjectType))) {
        formObj.movingObjectType = null;
      } else {
        formObj.movingObjectType = +formObj.movingObjectType;
      }

      let serializedForm = JSON.stringify(formObj);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        })
      }

      this.http
        .post<IProposal>('http://localhost:5124/api/Proposals/initiateProposal', serializedForm, httpOptions)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/proposal-details', response.id]);
          },
          error: (error) => {
            if(error.status == 401){
              this.router.navigate(['login'])
            }
            else{
              this.toastr.error(error.error)
            }
          },
        });
    }
  }

  ngOnInit(): void {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['login'])
    }

    for (let item in MovingObjectType) {
      if (isNaN(Number(+item))) {
        continue;
      }

      this.movingObjectTypes.push({ key: +item, value: MovingObjectType[item] })
    }

    this.inquiryForm = this.formBuilder.group({
      distance: ['0', [Validators.required]],
      livingAreaVolume: ['0', [Validators.required]],
      atticAreaVolume: ['0', [Validators.required]],
      movingObjectType: ['Choose Moving Object Type']
    });
  }
}
