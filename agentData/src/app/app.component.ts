
import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
// import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    agents = [];
    log;
    agentName;
    pages = [];
    currentPage = 0;
    public searchText: string ;
    details: any;
    selectedAgent = false;
    // companyId:any='';
    // pageNumber:any='';
    // updatedSince:any='';
    // agentId:any='';
    data: any = {
        moxi_works_company_id: "moxi_works",
        page_number: 1,
        updated_since: '1461108284',
        moxi_works_agent_id: "demo_4@moxiworks.com"
    };
    constructor(private _http: HttpClient, private _route: ActivatedRoute, private _router: Router, private spinner: NgxSpinnerService) { }

    ngOnInit() {
           this.spinner.show();
        this.getUrlParams();
        this._http.post(`http://localhost:3000/api/data`, this.data).subscribe(agent_data => {
            // console.log(this.data)
            this.log = agent_data;
            this.agents = this.log.agents;
            for (var i = 0; i < this.log.total_pages; i++) {
                this.pages.push(i);
            }
            this.spinner.hide();
        })
    }
    getUrlParams() {
        this._router.navigate(['/'], { queryParams: this.data });
    }
    getnextpages(i) {
        this.spinner.show();
        this.currentPage = i;
        this.data.page_number = this.currentPage + 1;
        console.log(this.data)
        this._http.post('http://localhost:3000/api/data', this.data).subscribe(agent_data => {
            this.log = agent_data;
            this.agents = this.log.agents;
            this.spinner.hide();
        })
    }
    // getFirstData(){
    //     // this.spinner.show();
    //     // this.getUrlParams();
    //     // this._http.post(`http://localhost:3000/api/data`, this.data).subscribe(agent_data => {
    //     //     // console.log(this.data)
    //     //     this.log = agent_data;
    //     //     this.agents = this.log.agents;
    //     //     for (var i = 0; i < this.log.total_pages; i++) {
    //     //         this.pages.push(i);
    //     //     }
    //     //     this.spinner.hide();
    //     // })
    //     console.log(this.data)
    // }
    getalldata(agent) {
        this.selectedAgent = !this.selectedAgent;
        this.details = agent;
        this.agentName = this.details.name;
        console.log(typeof (this.details));
    }
}