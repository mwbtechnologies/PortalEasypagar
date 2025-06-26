import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-ytvideos',
  templateUrl: './ytvideos.component.html',
  styleUrls: ['./ytvideos.component.css']
})
export class YtvideosComponent {

  Name:any
  AdminId:any
  YoutubeVideos:any[]=[]


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private globalToastService: ToastrService, 
  private _commonservice: HttpCommonService,private sanitizer: DomSanitizer,
   public dialogRef: MatDialogRef<YtvideosComponent>
  ) {
    this.Name = this.data.row?.Text
  }
  ngOnInit() {
    this.AdminId = localStorage.getItem("AdminID");
    this._commonservice.ApiUsingGetWithOneParam("Common/GetHelpVideos?UserID="+this.AdminId+"&Module="+this.Name+"&Key=en").subscribe((res:any)=>{
      this.YoutubeVideos = res.List
    })
  }
  getEmbedUrl(videoUrl: string): SafeResourceUrl {
    const videoId = new URL(videoUrl).searchParams.get('v');
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
