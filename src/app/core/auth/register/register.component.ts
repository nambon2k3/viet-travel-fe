import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterConponent {
    signupForm!: FormGroup;
    hidePassword = true;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder,
        private router: Router,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.signupForm = this.fb.group(
            {
                username: [
                    null,
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(12),
                        Validators.pattern('^[a-zA-Z0-9]*$'),
                    ],
                ],
                password: [
                    null,
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*$' // At least 1 lowercase, 1 uppercase, 1 special char
                        ),
                    ],
                ],
                fullName: [
                    null,
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'), // Allows alphabets and spaces
                    ],
                ],
                email: [null, [Validators.required, Validators.email]],
                confirmPassword: [null, [Validators.required]],
            },
            {
                validators: this.passwordMatchValidator,
            }
        );
    }

    // Custom validator to check if password and confirmPassword match
    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    togglePasswordVisibility() {
        this.hidePassword = !this.hidePassword;
    }

    onSubmit(): void {
        this.errorMessage = null;
    
        if (this.signupForm.invalid) {
            this.setErrorMessage();
            return;
        }
    
        const { confirmPassword, ...formData } = this.signupForm.value;
    
        this.authService.register(formData).pipe(
            catchError((error) => {
                this.errorMessage = 'An error occurred during registration. Please try again.';
                console.error('Error during signup:', error);
                return of(null);
            })
        ).subscribe(
            (response: any) => {
                console.log('Signup successful:', response);
                this.router.navigateByUrl('/login');
            }
        );
    }    

    // Set error messages based on form validation
    private setErrorMessage() {
        const controls = this.signupForm.controls;

        if (controls['username'].invalid) {
            this.errorMessage =
                'Username must be 6-12 characters long and contain only alphanumeric characters.';
        } else if (controls['email'].invalid) {
            this.errorMessage = 'Please enter a valid email address.';
        } else if (controls['fullName'].invalid) {
            this.errorMessage = 'Full name must contain only alphabetic characters.';
        } else if (controls['password'].invalid) {
            this.errorMessage =
                'Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 special character.';
        } else if (this.signupForm.hasError('mismatch')) {
            this.errorMessage = 'Passwords do not match.';
        }
    }
}
