import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    // utilisation des validateurs pour le login
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  onLogin() {
    // Prise en compte des champs email et mot de passe
    this.loading = true;
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    this.auth.loginUser(email, password).pipe(
      tap(() => {
        this.loading = false;
        // renvoie sur la page cards
        this.router.navigate(['/cards']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMsg = error.error;
        return EMPTY;
      })
    ).subscribe();
  }


}
