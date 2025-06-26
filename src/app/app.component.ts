import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MessagingService } from './services/messaging.service';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { internetCheckService } from './services/internetCheck.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]);
URL:any;
title = 'push-notification';
message:any;
  UserID: any;
  isOnline: boolean = true;
  constructor(private globalToastService : ToastrService,private internetCheckService: internetCheckService,private router: Router, private _route: Router,private messagingService: MessagingService) {
    //this.translateService.setDefaultLang('en');
  }

  position = 'top-right';

  ngOnInit() {
    this.requestPermission();
    this.listen();
    this.internetCheckService.getInternetStatus().subscribe(isOnline => {
      this.isOnline = isOnline;
      if (!isOnline) {
        // this.router.navigate(['/nointernet']);
        this.globalToastService.error("No internet connection.", "Please check your internet connection.");
      } else {
        // this.router.navigate(['/appdashboard'],);
        this.globalToastService.success("You are now online.", "Internet connection restored.");
      }
    });
//     this.messagingService.requestPermission()
// this.messagingService.receiveMessage()
// this.message = this.messagingService.currentMessage;
this.URL=window.location.href;
var array=this.URL.split('/');
if(array.length>4)
{
var page=array[4];
if(page=="ForgotPassword")
{
this._route.navigate(['/ForgotPassword']);
}
else if(page=="signup")
{
  this._route.navigate(['/signup']);
}
else{
  this.UserID=localStorage.getItem("UserID");
  if (this.UserID == null||this.UserID==undefined||this.UserID==0||this.UserID=="") {
    // localStorage.clear();
   // localStorage.clear();
    this._route.navigate(["auth/signin"]);
  }
  else{
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
}
else{
  // localStorage.clear();
  localStorage.clear();
  this._route.navigate(["auth/signin"]);
}

// const messaging = getMessaging();
// getToken(messaging, { vapidKey: 'AIzaSyDRRp4BjpniwxxFZ3Pb_A1-tzT_5okJl-k' }).then((currentToken) => {
//   if (currentToken) {
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
          //  console.log("Hurraaa!!! we got the token.....");
          //  console.log(currentToken);
           localStorage.setItem("DeviceToken",currentToken)
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
     self.addEventListener('push', (event: Event) => {
  const title = 'Notification Title';
  const body = 'Notification Body';
  const icon = 'path/to/icon.png';
  const tag = 'notification-tag';
  const data = { customData: 'some data' };

  // @ts-ignore
  event.waitUntil(
    // self.registration.showNotification(title, {
    //   body: body,
    //   icon: icon,
    //   tag: tag,
    //   data: data
    // })
  );
});



    //   self.addEventListener('push', function(event) {
    //     event.waitUntil(
    //       self.registration.pushManager.getSubscription()
    //         .then(function(subscription) {
    //           return fetch('url')
    //             .then(function(response) {
    //               return self.registration.showNotification('title', {});
    //             });
    //         });
    //     );
    //   }
    // )
  });
  }
}
