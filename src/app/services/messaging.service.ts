import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class MessagingService {currentMessage = new BehaviorSubject(null);constructor(private angularFireMessaging: AngularFireMessaging) {
  this.angularFireMessaging.messages.subscribe(
    (_messaging: any) => {
    _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
  })
}
requestPermission() {
this.angularFireMessaging.requestToken.subscribe(
(token) => {
console.log(token);
},
(err) => {
console.error('Unable to get permission to notify.', err);
});}

receiveMessage() {
this.angularFireMessaging.messages.subscribe(
(payload:any) => {
console.log("new message received. ", payload);
this.currentMessage.next(payload);
})}
}