import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProposal, MovingObjectType } from '../proposal-list/proposal-list.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.css']
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  proposal: IProposal | undefined;
  id: number | undefined;
  private sub: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        })
      }

      this.http
        .get<IProposal>('http://localhost:5124/api/Proposals/details/' + this.id, httpOptions)
        .subscribe({
          next: (response) => {
            if(!!response.movingObjectType) {
              response.movingObjectTypeName = MovingObjectType[response.movingObjectType]
            } else {
              response.movingObjectTypeName = '/';
            }

            this.proposal = response;
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
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
