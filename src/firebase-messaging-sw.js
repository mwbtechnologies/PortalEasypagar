importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-analytics.js');
firebase.initializeApp({ 
        apiKey: "AIzaSyD88B_MqgfdSK8qESrvlyr2HM-126s8R6g",
        authDomain: "pagarplus-6defd.firebaseapp.com",
        databaseURL:"https://pagarplus-6defd-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "pagarplus-6defd",
        storageBucket: "pagarplus-6defd.appspot.com",
        messagingSenderId: "357156690886",
        appId: "1:357156690886:web:26b6532165b7ee30bff0c7",
        measurementId: "G-MGP8S3VH35"
});
console.log(firebase);
// firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);