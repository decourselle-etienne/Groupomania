import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Subject, Observable, subscribeOn, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthVerify } from './auth-verify.service';
import { User } from '../models/user.model';

@Injectable()

export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  isCreator$ = new BehaviorSubject<boolean>(false);

  authToken = '';
  private userId = '';
  user!: User;
  private users: User[] = [];
  user$ = new Subject<User[]>();

  constructor(private http: HttpClient,
    private router: Router) { }

  // fonction de création de l'utilisateur
  createUser(email: string, password: string, prenom: string, nom: string) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/auth/signup', { email: email, password: password, prenom: prenom, nom: nom });
  }

  // fonction pour reprendre les données utilisateur
  getUserValue() {
    let storageUser = String(localStorage.getItem('User'));
    return storageUser
  }

  // fonction de login > enregistrement du statut connecté et des données principales User
  loginUser(email: string, password: string) {
    return this.http.post<{ nom: string, prenom: string, role: string, userId: string, token: string }>('http://localhost:3000/api/auth/login', { email: email, password: password }).pipe(
      tap((user) => {
        this.userId = user.userId;
        this.authToken = user.token;
        this.isAuth$.next(true);
        localStorage.setItem('User', JSON.stringify(user));
        localStorage.setItem('Auth', String(this.isAuth$.value));
      })
    );
  }


  //fonction de Déconnexion, suppression de toutes les données et de l'authetification
  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['auth/login']);
    localStorage.clear();
  }
}
