import { Component, OnInit } from '@angular/core';
import { IProposal, MovingObjectType } from './proposal-list.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css']
})
export class ProposalListComponent implements OnInit {

  fullName: string | null = localStorage.getItem("fullName");
  proposals: Array<IProposal> = new Array<IProposal>();

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem("token")) {
      this.router.navigate(['login'])
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      })
    }

    this.http
        .get<Array<IProposal>>('http://localhost:5124/api/Proposals', httpOptions)
        .subscribe({
          next: (response) => {
            response.forEach((item) => {
              if(!!item.movingObjectType) {
                item.movingObjectTypeName = MovingObjectType[item.movingObjectType]
              }
            })
            this.proposals = response;
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
