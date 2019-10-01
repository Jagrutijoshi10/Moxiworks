import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, finalize } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    agents = [];
    log;
    agentName;
    message;
    pages = [];
    currentPage = 0;
    public searchText: string;
    details: any;
    selectedAgent = false;
    start: any;
    end: any;
    // selected=false;
    limit: any = 10;
    selectedLimit:any=10;
    downloadedData:any;
    displayedColumns: string[] = ['agent id', 'client office id', 'name', 'email id'];
    csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Agent List :',
        useBom: true,
        noDownload: false,
        headers: ["moxi_works_agent_id", "client_agent_id", "mls_agent_id","license","mls_name", "mls_abbreviation", "moxi_works_office_id", "office_id", "client_office_id", "company_id", "client_company_id", "office_address_street", "office_address_street2", "office_address_city", "office_address_state", "office_address_zip", "name", "first_name", "last_name", "nickname", "mobile_phone_number", "alt_phone_number", "fax_phone_number", "main_phone_number","office_phone_number", "primary_email_address", "secondary_email_address", "lead_routing_email_address", "title", "uuid", "has_product_access", "has_engage_access", "access_level","website_base_url", "twitter", "google_plus", "facebook", "instagram", "blogger", "youtube", "linked_in", "pinterest", "home_page", "profile_image_url", "profile_thumb_url", "region", "created_timestamp", "deactivated_timestamp"]
      };
    
    // companyId: any = 'moxi_works';
    // pageNumber: any = '1';
    // updatedSince: any = '1461108284';
    // agentId: any = 'demo_4@moxiworks.com';
    formdata;
    isClicked = false;
    data: any = {
        moxi_works_company_id: 'moxi_works',
        page_number: '1',
        updated_since: '1461108284',
        moxi_works_agent_id: 'demo_4@moxiworks.com'
    };
    constructor(private _http: HttpClient, private spinner: NgxSpinnerService) { }
    ngOnInit() {
        this.formdata = new FormGroup({
            companyId: new FormControl(''),
            pageNumber: new FormControl(''),
            updatedSince: new FormControl(''),
            agentId: new FormControl('')
        });
        this.spinner.show();
        
        this._http.post(`http://localhost:3000/api/data`, this.data)
            .pipe(
                switchMap(() => {
                    return this._http.get(`http://localhost:3000/api/records?start=0&end=${this.limit}`);
                }),
                finalize(() => {
                    this.spinner.hide();
                })
            ).subscribe((agent_data: any) => {
                this.log = agent_data;
                this.agents = this.log.res;
                console.log(this.agents);
                for (let i = 0; i < Math.ceil(this.log.length / this.limit); i++) {
                        this.pages.push(i);
                    }
            });
    }
    onLimitChange(event) {
        this.spinner.show();
        this.selectedLimit=event.value;
        if(parseInt(this.selectedLimit)===this.limit){
            this.spinner.hide();
        }
       else{
       this.limit=this.selectedLimit;
        this.pages.splice(0, this.pages.length);
       
        this._http.post(`http://localhost:3000/api/data`, this.data)
        .pipe(
            switchMap(() => {
                return this._http.get(`http://localhost:3000/api/records?start=0&end=${this.limit}`);
            }),
            finalize(() => {
                this.spinner.hide();
            })
        ).subscribe((agent_data: any) => {
            this.log = agent_data;
            this.agents = this.log.res;
            console.log(this.agents);
            for (let i = 0; i < Math.ceil(this.log.length / this.limit); i++) {
                this.pages.push(i);
            }
        });
    }
    }
    getnextpages(i) {
        this.spinner.show();
        if (this.currentPage === i) {
            // this.pageNumber=i+1;
            // this.currentPage = i;
            this.spinner.hide();
        } else {
            this.isClicked = true;
            this.currentPage = i;
            // this.data.page_number = this.currentPage + 1;
            this.start = i * this.limit;
            this.end = (i + 1) * this.limit;
            if (this.log.length < this.end) {
                this.end = this.log.length;
            }

            // console.log(i)
            // this._http.post('http://localhost:3000/api/data', this.data).subscribe(agent_data => {
            //     this.log = agent_data;
            //     this.agents = this.log.res;
            //     this.pageNumber=i+1;
            //     this.spinner.hide();
            // })            

            this._http.get(`http://localhost:3000/api/records?start=${this.start}&end=${this.end}`).subscribe((agent_data:any) => {
                this.log = agent_data;
                this.agents = this.log.res;
                // console.log(this.agents);
                this.spinner.hide();
            });
        }
    }
    // getParams(info) {

    //     this.spinner.show();
    //     if(this.currentPage==(info.pageNumber-1)){
    //        this.spinner.hide();
    //     }
    //     else{
    //         this.currentPage=info.pageNumber-1;
    //         this.data.moxi_works_company_id = info.companyId;
    //         this.data.page_number = info.pageNumber;
    //         this.data.updated_since = info.updatedSince;
    //         this.data.moxi_works_agent_id = info.agentId;
    //         // console.log(this.data)
    //         this._http.post('http://localhost:3000/api/data', this.data).subscribe(agent_data => {
    //             this.log = agent_data;
    //             this.agents = this.log.res;
    //             this.spinner.hide();
    //         })
    //     }

    // }
    getAgentLog(agent) {
        this.selectedAgent = !this.selectedAgent;
        this.details = agent;
        this.agentName = this.details.name;
        // console.log(typeof (this.details));
    }
    
    downloadCSV(){
        //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
        this._http.get(`http://localhost:3000/api/allrecords`).subscribe((dwndata:any) => {
        this.downloadedData = dwndata;
        console.log(this.downloadedData);
        new  AngularCsv(this.downloadedData, "agentList", this.csvOptions);

    });
      }
}
