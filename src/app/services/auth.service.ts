import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { User } from './../model/user.model';
import { environment } from './../../environments/environment';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private token: string;
    private authStatus: boolean = false;
    private userId: string;
    private authStatusEvent = new Subject<{authStatus: boolean, userId: string }>();

    constructor(private http: HttpClient,
                private route: Router,
                private snackBar: MatSnackBar ) {}

    getToken(): string {
        return this.token;
    }

    getUserId(): string {
        return this.userId;
    }

    getAuthStatus(): boolean {
        return this.authStatus;
    }

    getAuthStatusEvent() {
        return this.authStatusEvent;
    }

    autoLogin() {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');
        const expiresInMS = Date.parse(expiresIn) - Date.now();
        if(expiresInMS > 0 && userId && token) {
            setTimeout(() => {this.logout()}, expiresInMS);
            this.route.navigate(['/']);
            this.authStatus = true;
            this.authStatusEvent.next({authStatus: this.authStatus, userId: this.userId});
        }
        else {
            this.route.navigate(['/login']);
        }
    }

    signup(username: string, password: string) {
        const user: User = {username: username, password: password, userId: null};
        this.http.post<{message: string, token: string}>(environment.apiUrl + 'auth/signup', user)
        .subscribe(
            (data) => {
                console.log(data);
            },
            (err) => {
                this.snackBar.open(err.error.message, 'Dismiss', {duration: 5000})
            }
        );
    }

    login(username: string, password: string) {
        const user: User = {username: username, password: password, userId: null};
        this.http.post<{message: string, token: string, userId: string, expiresIn: number}>(environment.apiUrl +'auth/login', user)
        .subscribe(
            (data) => {
                if(data.token !== undefined && data.token !== '') {
                    this.token = data.token;
                    this.userId = data.userId;
                    this.authStatus = true;
                    this.authStatusEvent.next({authStatus: this.authStatus, userId: this.userId});
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('userId', this.userId);
                    localStorage.setItem('expiresIn', (new Date(Date.now() + data.expiresIn * 1000)).toISOString());
                    setTimeout(() => {this.logout()}, data.expiresIn * 1000);
                    this.route.navigate(['/']);
                }
            },
            (err) => {
                this.snackBar.open(err.error.message, 'Dismiss', {duration: 5000})
            }
        );
    }

    logout() {
        this.authStatus = false;
        this.userId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiresIn');
        this.authStatusEvent.next({authStatus: this.authStatus, userId: this.userId});
    }

}