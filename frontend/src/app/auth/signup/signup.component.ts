import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  loading!: boolean;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    // prise en compte des champs email, password, prenom et nom pour l'inscription
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{9}$')]],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
    });
  }

  // création d'un nouvel utilisateur au click sur le bouton
  onSignup() {
    this.loading = true;
    const prenom = this.signupForm.get('prenom')!.value;
    const nom = this.signupForm.get('nom')!.value;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    this.auth.createUser(email, password, prenom, nom)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password)),
        tap(() => {
          this.loading = false;
          this.router.navigate(['/cards']);
        }),
        // si erreur, renvoie sur la page d'inscription
        catchError(error => {
          this.loading = false;
          this.router.navigate(['auth/signup']);
          this.errorMessage = error.error;
          return EMPTY;
        })
      )
      .subscribe()

  }

}
