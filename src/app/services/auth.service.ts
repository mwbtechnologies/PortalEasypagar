// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('Token'); // Assuming you store a token in localStorage
    return !!token; // return true if token exists
  }

  // Method to log the user out
  logout() {
    localStorage.removeItem('authToken');
  }
}
