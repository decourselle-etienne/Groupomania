import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user!: User;
  userId!: string;


  constructor(private router: Router, private auth: AuthService, private http: HttpClient) { }

  ngOnInit() {
    //permet de garder la connexion avec le localStorage. il faut se Logout pour se déconnecter
    let authentification = localStorage.getItem('Auth');
    if (authentification == 'true') {
      this.auth.isAuth$.next(true);
    };
  }
}
