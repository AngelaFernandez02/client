import { Injectable, Output } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  //private user = 'token';
  private userKey = 'token';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/register`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, response.token);
          }
          return response;
        })
      );
  }


  getDetail(): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}Account/detail`);
  }

forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/forgot-password`, { email });
  }


  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/change-password`,data);
  }

 getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return true;
  };

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    //if (isTokenExpired) this.logout();
    return true;
  }

  logout = (): void => {
    localStorage.removeItem(this.userKey);
  };

 getAll(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.apiUrl}Account`);
 }

 refreshToken(data: { email: string; token: string; refreshToken: string }): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, data);
}

getRoles = (): string[] => {
  const token = this.getToken();
  if (!token) return [];
  const decodedToken: any = jwtDecode(token);
  return Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
};


 getToken = (): string | null => {
    const userData = localStorage.getItem(this.userKey);
    if (!userData) return null;

    try {
      const parsedData = JSON.parse(userData);
      return parsedData.token || parsedData;
    } catch {
      return userData;
    }
  };



getrefreshToken = (): string | null =>{
const user = localStorage.getItem(this.userKey);
 if(!user) return null;
    //localStorage.getItem(this.userKey) || '';
    const UserDetail:AuthResponse=JSON.parse(user);
    return UserDetail.refreshToken
};


resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}Account/reset-password`, data);
}

} 
