import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { Card } from '../models/card.model';
import { AuthService } from '../services/auth.service';
import { GroupomaniaCardService } from '../services/groupomania-card.service';

@Component({
  selector: 'app-groupomania-card',
  templateUrl: './groupomania-card.component.html',
  styleUrls: ['./groupomania-card.component.scss']
})
export class GroupomaniaCardComponent implements OnInit {

  @Input() card!: Card;
  isAuth$!: Observable<boolean>;
  userId!: string;
  cards$!: Observable<Card[]>;
  isCreator$!: Observable<boolean>;


  constructor(private cardService: GroupomaniaCardService,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
  }

  Modify() {
    try {
      this.router.navigate(['/modify-card/' + this.card._id])
    }
    catch (error) {
      console.error(error);
      this.router.navigate(['/cards']);
    }



    //this.cardService.modifyCard(String(this.card._id), this.card, this.card.imageUrl);
  }

  Delete() {
    this.cardService.deleteCard(String(this.card._id))
      .subscribe();
  }

  Like() {
    const user = JSON.parse(String(localStorage.getItem('User')));
    this.userId = user.userId;
    if (!this.card.usersLiked) {
      this.card.usersLiked = [];
    };
    const like = !this.card.usersLiked.includes(this.userId);
    this.cardService.likeCard(this.userId, String(this.card._id), like)
      .subscribe()
  }

  canDeleteOrModify() {
    const user = JSON.parse(String(localStorage.getItem('User')));
    this.userId = user.userId;
    if (this.card.userId === this.userId || user.role === 'admin') {
      return true
    }
    else {
      return false
    }
  }

}



