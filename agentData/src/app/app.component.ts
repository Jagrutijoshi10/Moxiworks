import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, finalize } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import * as fileSaver from 'file-saver';
import 'rxjs/Rx' ;
import {saveAs} from 'file-saver';

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
    limit: any = 10;
    selectedLimit: any;
    downloadedData: any;
    filename:any="Agent List";
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
        headers:[]
    };
        // headers: ["MOXI-WORKS AGENT ID", "CLIENT AGENT ID", "MLS AGENT ID", "LICENSE", "MLS NAME", "MLS ABBREVIATION", "MOXI-WORKS OFFICE ID", "OFFICE ID", "CLIENT OFFICE ID", "COMPANY ID", "CLIENT COMPANY ID", "OFFICE ADDRESS STREET", "OFFICE ADDRESS STREET 2", "OFFICE ADDRESS CITY", "OFFICE ADDRESS STATE", "OFFICE ADDRESS ZIP", "NAME", "FIRST NAME", "LAST NAME", "NICKNAME", "MOBILE PHONE NUMBER", "ALT PHONE NUMBER", "FAX PHONE NUMBER", "MAIN PHONE NUMBER", "OFFICE PHONE NUMBER", "PRIMARY EMAIL ID", "SECONDARY EMAIL ADDRESS", "LEAD ROUTING EMAIL ADDRESS", "TITLE", "UUID", "HAS-PRODUCT-ACCESS", "HAS-ENGAGE-ACCESS", "ACCESS LEVEL", "WEBSITE BASE URL", "TWITTER", "GOOGLE PLUS", "FACEBOOK", "INSTAGRAM", "BLOGGER", "YOUTUBE", "LINKED_IN", "PINTEREST", "HOME_PAGE", "PROFILE IMAGE URL", "PROFILE THUMB URL", "REGION", "CREATED_TIMESTAMP", "DEACTIVATED_TIMESTAMP","AGENT ID FROM URL"]


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
                // this.header = Object.keys(agent_data[0]);
                console.log(this.log);
                console.log(this.log.length)
                for (let i = 0; i < Math.ceil(this.log.length / this.limit); i++) {
                    this.pages.push(i);
                }
            });
            }
    onLimitChange(event) {
        this.spinner.show();
        this.selectedLimit = event.value;
        if (parseInt(this.selectedLimit) === this.limit) {
            this.spinner.hide();
        }
        else {
            this.limit = this.selectedLimit;
            this.pages.splice(0, this.pages.length);
            for (let i = 0; i < Math.ceil(this.log.length / this.limit); i++) {
                this.pages.push(i);
            }
            this._http.get(`http://localhost:3000/api/records?start=0&end=${this.limit}`).subscribe((agent_data: any) => {
                this.log = agent_data;
                this.agents = this.log.res;
                this.spinner.hide();
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

            this._http.get(`http://localhost:3000/api/records?start=${this.start}&end=${this.end}`).subscribe((agent_data: any) => {
                this.log = agent_data;
                this.agents = this.log.res;
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
    }
    downloadCSV() {   
        this._http.get(`http://localhost:3000/api/allrecords`).subscribe((dwndata: any) => {
            this.downloadedData = dwndata;
    //         for(var i=0;i<this.downloadedData.length;i++){
    //             this.downloadedData[i]=this.downloadedData[i].replace(',',";")
    // }

          
            // this.csvOptions.headers=Object.keys(this.downloadedData[0]);
             
            // let objdata=[];
            // let key=[]
            // let values=[]
            // for(var i=0;i<this.downloadedData.length;i++){
            //     key=Object.keys(this.downloadedData[i]);
            //      values=Object.values(this.downloadedData[i]);
            //      for(var j=0;j<values.length;j++){
            //         if(values[j]!=null){
            //             if(values[j].toString().indexOf(',')>-1){
            //                 values[j]= values[j].replace(',','');
            //             // objdata.push(values[i])
            //             }
                        
            //         }
                   
            //      }
            //     //  console.log(values)
            //      objdata.push(values)
            //     objdata= Object.assign(values,key)
            //             }
            //   new AngularCsv(objdata, "agentList", this.csvOptions);
            // //  console.log("1",objdata)

            
         
    //         let replacer = (key, value) => value === null ? '' : value;
    //         for(var i=0;i<this.downloadedData.length;i++){
    //               var tit=  this.downloadedData[i].title;
    //             if(this.downloadedData[i].title!=null){
    //                 if(this.downloadedData[i].title.toString().indexOf(',')>-1){
    //                     this.downloadedData[i].title= this.downloadedData[i].title.replace(',','&')
    //                 }
    //             }
    //             console.log(this.downloadedData[i].title)

    //         }
    //         const header = Object.keys(dwndata[0]);
    //         let csv = dwndata.map(row => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
    //         csv.unshift(header.join(','));
    //         let csvArray = csv.join('\r\n');
    //         var blob = new Blob([csvArray], {type: 'text/csv' })
    //         saveAs(blob, this.filename + ".csv");
        });
    }

    
}
