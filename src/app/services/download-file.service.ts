import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(private httpclient:HttpClient) { }
public DownloadFile(URL:any)
{
  return this.httpclient.get(URL,
    {observe:'response',responseType:'blob'});
}
}
