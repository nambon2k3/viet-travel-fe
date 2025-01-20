import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(username, password).subscribe(
        () => {
          this.snackBar.open('Login successful', 'Close', { duration: 5000 });
          this.router.navigate(['/c/user-profile']);
        },
        () => {
          this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 5000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', { duration: 5000 });
    }
  }
}
