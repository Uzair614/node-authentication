import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signInUrl = 'http://localhost:3000/signin';
  signUpUrl = 'http://localhost:3000/signup';
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  signIn(body: AuthRequest): Observable<any> {
    return this.http
      .post(this.signInUrl, body, this.httpOptions)
      .pipe(tap(_ => console.log('received signin')));
  }

  signUp(body: AuthRequest): Observable<any> {
    return this.http
      .post(this.signInUrl, body, this.httpOptions)
      .pipe(tap(_ => console.log('received signin')));
  }
}
