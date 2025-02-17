import { Component } from '@angular/core';
import { Locations } from '../../../../../core/models/location.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { CommonModule } from '@angular/common';
import { VietnamMapComponent } from "./vietnam-map/vietnam-map.component";

@Component({
  selector: 'app-post-location-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VietnamMapComponent
  ],
  templateUrl: './post-location-detail.component.html',
  styleUrl: './post-location-detail.component.css'
})
export class PostLocationDetailComponent {
  editLocationForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  locationId: string | null = null;
  location: Locations = <Locations>{};

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.loadLocationById(this.locationId);
      }
    });
  }

  initForm(): void {
    this.editLocationForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      deleted: [false],
      geoPosition: this.fb.group({
        latitude: [0, Validators.required],
        longitude: [0, Validators.required]
      })
    });
  }


  loadLocationById(id: string): void {
    this.locationService.getLocationById(id).subscribe({
      next: (response: any) => {
        if (response?.code === 200) {
          this.location = response.data;
          this.editLocationForm.patchValue({
            id: this.location.id,
            name: this.location.name,
            description: this.location.description,
            image: this.location.image,
            deleted: this.location.deleted,
            geoPosition: {
              latitude: this.location.geoPosition?.latitude ?? 0,
              longitude: this.location.geoPosition?.longitude ?? 0
            }
          });

          if (this.location.image !== "image_url_here") {
            this.imagePreview = this.location.image;
          }

        } else {
          this.errorMessage = response?.message || 'An error occurred while loading location.';
        }
      },
      error: (err) => {
        console.error('Failed to load location:', err);
        this.errorMessage = 'An error occurred while loading location.';
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            this.imagePreview = e.target.result as string | ArrayBuffer;
          }
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  onLocationSelected(location: { name: string, latitude: number, longitude: number }): void {
    this.editLocationForm.patchValue({
      name: location.name,
      geoPosition: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/head-business/locations']);
  }

  saveChanges(): void {
    if (this.locationId) {
      this.updateLocation();
    } else {
      this.createLocation();
    }
  }
  
  updateLocation(): void {
    if (!this.selectedFile && !this.imagePreview) {
      this.editLocationForm.get('image')?.setValue(null);
    } else if (this.imagePreview) {
      this.editLocationForm.get('image')?.setValue(this.imagePreview);
    }
    
    const formData = this.editLocationForm.getRawValue();
  
    this.locationService.updateLocation(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while updating location.';
          this.errorMessage = apiError;
          this.successMessage = null;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
        } else {
          this.errorMessage = response?.message || 'An error occurred while updating location.';
          this.successMessage = null;
        }
      });
  }
  
  createLocation(): void {
    if (!this.selectedFile && !this.imagePreview) {
      this.editLocationForm.get('image')?.setValue(null);
    } else if (this.imagePreview) {
      this.editLocationForm.get('image')?.setValue(this.imagePreview);
    }
  
    const formData = this.editLocationForm.getRawValue();
  
    this.locationService.createLocation(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while creating location.';
          this.errorMessage = apiError;
          this.successMessage = null;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
          this.router.navigate(['/head-business/locations']);
        } else {
          this.errorMessage = response?.message || 'An error occurred while creating location.';
          this.successMessage = null;
        }
      });
  }
}
