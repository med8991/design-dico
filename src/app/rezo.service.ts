import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders ({
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Headers" : "Content-type",
  "Content-Type": "text/html,application/json",
  "Access-Control-Allow-Origin":"*"
  })
}; 


@Injectable({
  providedIn: 'root'
})
export class RezoService {

  private BaseUrl : String = "https://jxdm.herokuapp.com/"
  

  constructor(private httpClient : HttpClient) { }

  public getWords(myword : String):Observable<any>{
    return this.httpClient.get(this.BaseUrl+"myterm/"+myword,httpOptions);
  }

  public addToCache(myword : Object):Observable<any>{
    return this.httpClient.post(this.BaseUrl+"addtocache",JSON.stringify(myword),httpOptions);
  }
}