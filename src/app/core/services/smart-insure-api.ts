import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmartInsureApi {

  constructor(private http: HttpClient) { }
  baseUrl: string = 'https://qa.data.smartapplicationsgroup.com:30501/si/admin';

  //  base URL = https://qa.data.smartapplicationsgroup.com:
  // PORT = 30501
  // SERVICE = /si/admin
  headers = {
    'countryCode': 'KE',
    'orgCode': 'QASI',
    'orgType': 'INSURER',

  }

  fetchCountries(jsonData: any) {
    return this.http.post(`${this.baseUrl}/country/search`, jsonData , { headers: this.headers });
  }
  
}
