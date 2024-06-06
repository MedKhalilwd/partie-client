import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // L'URL de votre API backend

  constructor(private router: Router, private http: HttpClient) { } // Ajout de "private" pour http

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/api/auth/sign-in`, credentials);

  }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
 }

  logout(){
    localStorage.removeItem('state');

    this.router.navigate(['/']);
    localStorage.removeItem('isLogged');
  }
  isLoggedIn(){
    // return localStorage.getItem('isLogged');
    return localStorage.getItem('state') === '0';

    // return localStorage.getItem('isLogged') === 'true';

  }

  getAllProduct(){
    return this.http.get(`${this.apiUrl}/products`)
  }


  addCmd(data: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/cmd/createCmd`, data);
 }
}
