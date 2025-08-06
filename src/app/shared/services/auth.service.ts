import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = new BehaviorSubject<string>("");
  private tokenData = new BehaviorSubject<any>({});
  private isLogged = new BehaviorSubject<boolean>(false);
  private isToggle = new BehaviorSubject<boolean>(false);
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any) { }

    get token$(){
      return this.token.asObservable();
    }

    get tokenValue() {
      return this.token.getValue();
    }

    get tokenData$(){
      return this.token.asObservable();
    }

    get isLogged$(){
      return this.isLogged.asObservable();
    }

    get isToggle$(){
      return this.isToggle.asObservable();
    }

    login(credenciales: any) {
      return this.http.post<any>(`${environment.API_URL}/auth`, credenciales)
        .pipe( map(data:any) => {
          return data;

        } ),
        catchError( (error)=> this.handleError(error) )

    }

    saveLocalStorage(token: string) {
      sessionStorage.setItem("accessToken",token);
    }

        checkToken() {
      if(isPlatformBrowser(this.platformId)){
        const token = sessionStorage.getItem("accessToken");
        if(token){
          const isExpired =helper.isTokenExpired(token);
          if(isExpired){
            this.logout();
          }else{
            this.token.next(token);
            const {iat,exp, ...payload}=helper.decodeToken(token);
            this.tokenData.next(payload);
            this.isLogged.next(true);
          }
        }else{
          this.logout();
        }
      }
    }

    logout () {
      sessionStorage.removeItem("accessToken");
      this.isLogged.next(false);
      this.token.next("");
      this.tokenData.next(null);
      this.router.navigate(['/login']);

    }

    toggleSidenav(flag: boolean) {
      if (flag) this.isToggle.next(flag)
    }

    handleError(error: any): Observable<never> {
      var message = "Ocurrio un error";
      if (error.error){
        message = `${error.error.message}`;
      }

      this.snackBar.open(message,'',{
        duration: 5*1000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      return throwError( () => Error(message) );
    }
}
