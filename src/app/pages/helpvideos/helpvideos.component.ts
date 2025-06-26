import { Component } from '@angular/core';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { YtvideosComponent } from './ytvideos/ytvideos.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-helpvideos',
  templateUrl: './helpvideos.component.html',
  styleUrls: ['./helpvideos.component.css']
})
export class HelpvideosComponent {
  AdminId:any
  HelpVideos:any[]=[]
  YoutubeVideos:any[]=[]
  IsYtVideo:boolean = false
  ytTitle:any;UserID:any;
constructor(private commonservice:HttpCommonService,public dialog: MatDialog,private sanitizer: DomSanitizer){
}

ngOnInit(){
  this.UserID = localStorage.getItem("UserID");
  this.getHelpVideos()
}

getHelpVideos(){
  this.commonservice.ApiUsingGetWithOneParam('Common/GetHelpModules?UserID='+this.UserID+'&Key=en').subscribe((res:any)=>{
    this.HelpVideos = res.List
  })
}

getParticularHelpVideo(data:any){
  this.IsYtVideo = true
  this.ytTitle = data.Text
  this.commonservice.ApiUsingGetWithOneParam("Common/GetHelpVideos?UserID="+this.UserID+"&Module="+data.Text+"&Key=en").subscribe((res:any)=>{
    this.YoutubeVideos = res.List
  })
}

GetYoutubeLinks(row:any){
  // this.dialog.open(YtvideosComponent,{
  //   data: { row }
  // })
  this.getParticularHelpVideo(row)
}
getEmbedUrl(videoUrl: string): SafeResourceUrl {
  const videoId = new URL(videoUrl).searchParams.get('v');
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}
}
