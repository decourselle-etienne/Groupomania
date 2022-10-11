import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouteConfigLoadEnd, Router, UrlSerializer } from '@angular/router';
import { catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Card } from '../models/card.model';
import { AuthService } from '../services/auth.service';
import { GroupomaniaCardService } from '../services/groupomania-card.service';

@Component({
  selector: 'app-new-groupomania-card',
  templateUrl: './new-groupomania-card.component.html',
  styleUrls: ['./new-groupomania-card.component.scss']
})
export class NewGroupomaniaCardComponent implements OnInit {

  cardForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  card!: Card;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cardService: GroupomaniaCardService,
    private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.cardService.getCardById(params['id'])
        }
      }),
      tap(card => {
        if (card) {
          this.card = card;
          this.initModifyForm(card);
          this.loading = false;
        }
      }
      ),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.cardForm = this.formBuilder.group({
      content: [null, Validators.required],
      image: [null],
    });
  }

  initModifyForm(card: Card) {
    this.cardForm = this.formBuilder.group({
      content: [card.content, Validators.required],
      image: [card.imageUrl],
    });
    this.imagePreview = this.card.imageUrl;
  }

  onSubmit() {
    let storageUser = String(localStorage.getItem('User'));
    let currentUser = JSON.parse(storageUser);
    this.loading = true;

    if (this.mode === 'new') {
      const newCard = new Card();
      newCard.content = this.cardForm.get('content')!.value;
      newCard.createdDate = new Date();
      newCard.likes = 0;
      newCard.prenom = currentUser.prenom;
      newCard.nom = currentUser.nom;
      newCard.usersLiked = [];
      newCard.userId = currentUser.userId;
      this.cardService.createCard(newCard, this.cardForm.get('image')!.value).pipe(
        tap(({ message }) => {
          this.loading = false;
          this.router.navigate(['/cards']);
        }),
        catchError(error => {
          console.error(error.message);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }

    else if (this.mode === 'edit') {
      const newCard = new Card();
      newCard.content = this.cardForm.get('content')!.value;
      newCard.userId = this.card.userId;
      this.cardService.modifyCard(String(this.card._id), newCard, this.cardForm.get('image')!.value).pipe(
        tap(({ message }) => {
          this.loading = false;
          this.router.navigate(['/cards']);
        }),
        catchError(error => {
          console.error(error.message);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.cardForm.get('image')!.setValue(file);
    this.cardForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

