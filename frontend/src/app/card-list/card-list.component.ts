import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { Card } from '../models/card.model';
import { GroupomaniaCardService } from '../services/groupomania-card.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  cards$!: Observable<Card[]>;
  loading!: boolean;
  errorMsg!: string;
  card!: Card;

  constructor(private cardsService: GroupomaniaCardService,
    private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.cards$ = this.cardsService.cards$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.cardsService.getCards();
  }
}
