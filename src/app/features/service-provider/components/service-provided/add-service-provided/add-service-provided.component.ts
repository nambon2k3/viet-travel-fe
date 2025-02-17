import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-service-provided',
  imports: [],
  templateUrl: './add-service-provided.component.html',
  styleUrls: ['./add-service-provided.component.css']
})
export class AddServiceProvidedComponent {
  imageUrl: string | ArrayBuffer | null = null; // Initialize with null

  constructor(private router: Router) {}

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement; // Type assertion for more clarity
    const file = fileInput.files?.[0]; // Optional chaining to safely access files

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                this.imageUrl = reader.result; // Check for null
            }
        };
        reader.readAsDataURL(file);
    }
  }

  onSubmit(form: any) {
    console.log(form.value);
    this.router.navigate(['/services']);
  }

  onCancel(): void {
    this.router.navigate(['/service-provider/services']);
  }
}