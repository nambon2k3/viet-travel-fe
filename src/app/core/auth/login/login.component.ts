import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, of } from 'rxjs';
import { UserStorageService } from '../../services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  errorMessage: string | null = null;
  passwordCriteria = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  };

  usernameCriteria = {
    minLength: false,
    maxLength: false,
    pattern: false,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userStorageService: UserStorageService
  ) { }

  ngOnInit() {
    const rememberedUsername = localStorage.getItem('rememberedUser')?.replaceAll('"', '');

    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: [
        rememberedUsername || null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9]*$'),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*$'),
        ],
      ],
    });

    // Username validation criteria
    this.loginForm.get('username')?.valueChanges.subscribe((value) => {
      this.usernameCriteria.minLength = value.length >= 8;
      this.usernameCriteria.maxLength = value.length <= 30;
      this.usernameCriteria.pattern = /^[a-zA-Z0-9]*$/.test(value);
    });

    // Listen to password changes for validation criteria
    this.loginForm.get('password')?.valueChanges.subscribe((value) => {
      this.validatePasswordCriteria(value);
    });
  }

  // Validate password criteria
  validatePasswordCriteria(password: string): void {
    this.passwordCriteria.minLength = password.length >= 8;
    this.passwordCriteria.uppercase = /[A-Z]/.test(password);
    this.passwordCriteria.lowercase = /[a-z]/.test(password);
    this.passwordCriteria.specialChar = /[\W_]/.test(password);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.errorMessage = null;

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    const rememberMe = (document.getElementById('remember-me') as HTMLInputElement).checked;

    this.authService
      .login(username, password)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred during sign in.';
          this.errorMessage = apiError;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response !== null) {
          const token = response.body.data.token;
          const user = response.body.data.username;
          if (rememberMe) {
            this.userStorageService.saveToken(token); // Save for 30 days
            this.userStorageService.saveUser(user); // Save for 30 days
            localStorage.setItem('rememberedUser', username);
          }
          this.router.navigateByUrl('/');
        } else {
          this.errorMessage = response?.message || 'An error occurred during sign in.';
        }
      });
  }
}
