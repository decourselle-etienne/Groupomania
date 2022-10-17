import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, mapTo, Observable, of, Subject, Subscriber, tap, throwError, } from 'rxjs';
import { Card } from '../models/card.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class GroupomaniaCardService {

  private cards: Card[] = [];
  cards$ = new Subject<Card[]>();


  constructor(private http: HttpClient,
    private auth: AuthService) { }

  // Prise des cards (posts) depuis l'API
  getCards(): Observable<Card[]> {
    this.http.get<Card[]>('http://localhost:3000/api/cards').pipe(
      tap(cards => {
        this.cards = cards;
        this.cards$.next(this.cards);
      }),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
    return this.cards$;
  }

  // permet de selectionner une card (post) spécifique via son Id
  getCardById(id: string) {
    return this.http.get<Card>('http://localhost:3000/api/cards/' + id).pipe(
      tap((card) => {
      }),
      catchError(error => throwError(error.error.message))
    );
  }

  // permet de liker un card
  likeCard(user: string, id: string, like: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/cards/' + id + '/like',
      { userId: user, like: like ? true : false }
    ).pipe(

      tap(() => {
        const index = this.cards.findIndex(card => card._id === id);
        if (index !== -1) {
          this.cards[index].likes = like ? this.cards[index].likes + 1 : this.cards[index].likes - 1;
          if (!this.cards[index].usersLiked) {
            this.cards[index].usersLiked = [];
          };
          if (like) {
            this.cards[index].usersLiked.push(user);
          }
          else {
            const userLikeIndex = this.cards[index].usersLiked.findIndex(id => user === id)
            if (userLikeIndex != -1) {
              this.cards[index].usersLiked.splice(userLikeIndex, 1);
            }
          }
          this.cards$.next(this.cards)
        }
      }),
      catchError(error => throwError(error.error.message))
    );
  }

  // permet de créer une card (post)
  createCard(card: Card, image: File) {
    const formData = new FormData();
    formData.append('card', JSON.stringify(card));
    formData.append('image', image);
    return this.http.post<{ message: string }>('http://localhost:3000/api/cards', formData).pipe(
      catchError(error => { throw new Error(error.message) })
    );
  }

  // permet de modifier une card (post)
  modifyCard(id: string, card: Card, image: string | File) {
    if (typeof image === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/cards/' + id, card).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('card', JSON.stringify(card));
      formData.append('image', image);
      return this.http.put<{ message: string }>('http://localhost:3000/api/cards/' + id, formData).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }

  // permet de supprimer une card (post)
  deleteCard(id: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/cards/' + id).pipe(
      tap(() => this.cards$.next(this.cards)),
      catchError(error => throwError(error.error.message))
    );
  }


}
