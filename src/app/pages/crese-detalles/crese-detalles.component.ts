import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreseService } from '../../services/crese.service';
import { CreseImagenesService } from '../../services/crese-imagenes.service'; 
import { MenuComponent } from '../../custom/menu/menu.component';
import { Crese } from '../../interfaces/crese';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { responseCreseImagenes } from '../../interfaces/responseCreseImagenes';

@Component({
  selector: 'app-crese-detalles',
  standalone: true,
  imports: [MenuComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './crese-detalles.component.html',
  styleUrls: ['./crese-detalles.component.css']
})
export class CreseDetallesComponent implements OnInit {
  creseForm!: FormGroup;
  creseId!: number;
  private fb = inject(FormBuilder);
  private creseService = inject(CreseService);
  private creseImagenesService = inject(CreseImagenesService); 
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.creseId = this.route.snapshot.params['id'];

    this.creseForm = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      texto: ['', Validators.required],
      videoUrl: ['', Validators.required],
      creseImagenes: this.fb.array([]) 
    });

    this.cargarCrese();
    this.cargarImagenes(); 
  }
  get creseImagenes(): FormArray {
    return this.creseForm.get('creseImagenes') as FormArray;
  }

  cargarCrese() {
    this.creseService.obtenerCresePorId(this.creseId).subscribe((crese: Crese) => {
      this.creseForm.patchValue({
        id: crese.id,
        titulo: crese.titulo,
        texto: crese.texto,
        videoUrl: crese.videoUrl,
      });
    });
  }

  cargarImagenes() {
    this.creseImagenesService.obtenerCreseImagenPorCreseId(this.creseId).subscribe((response: responseCreseImagenes) => {
      const imagenesControl = this.creseForm.get('creseImagenes') as FormArray;
      
      response.value.forEach(imagen => {
        imagenesControl.push(this.fb.group({
          id: [imagen.id],
          creseId : [imagen.creseId, Validators.required],
          imagenUrl: [imagen.imagenUrl, Validators.required],
          
        }));
        console.log("Estoy cargando la imagen con id: "+ imagen.id + " para el crece con id: "+ imagen.creseId);
      });
    });
  }

  actualizarCrese() {
    if (this.creseForm.valid) {
      const imagenesControl = this.creseForm.get('creseImagenes') as FormArray;
  
      this.creseService.actualizarCrese(this.creseId, this.creseForm.value).subscribe({
        next: () => {
          // Recorrer el FormArray
          imagenesControl.controls.forEach((imagenForm, index) => {
            const imagenId = imagenesControl.at(index).get('id')?.value;
            console.log("Esto es lo que hay en la imagen: "+ imagenForm.value.id + " " +imagenForm.value.creseId);
  
            if (imagenId) {
              // Actualizar imagen existente
              this.creseImagenesService.actualizarCreseImagen(imagenId, imagenForm.value).subscribe({
                next: () => {
                  console.log(`Imagen ${imagenId} actualizada correctamente`);
                },
                error: (error) => {
                  console.error(`Error al actualizar la imagen ${imagenId}:`, error);
                }
              });
            } else {
              // Crear nueva imagen
              let nuevaImagen = {
                imagenUrl: imagenForm.value.imagenUrl,
                creseId: this.creseForm.get('id')?.value
              };
              this.creseImagenesService.crearCreseImagen(nuevaImagen).subscribe({
                next: () => {
                  console.log('Imagen creada correctamente');
                },
                error: (error) => {
                  console.error('Error al crear imagen:', error);
                }
              });
            }
          });
  
          // Navegar después de todas las operaciones (puedes optar por esperar)
          this.router.navigate(['/administrar']);
        },
        error: (error) => {
          console.error('Error al actualizar registro Crese:', error);
        }
      });
    }
  }
  

  eliminarCrese() {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.creseService.eliminarCrese(this.creseId).subscribe({
        next: () => {
          this.router.navigate(['/administrar']);
        },
        error: (error) => {
          console.error('Error al eliminar registro Crese:', error);
        }
      });
    }
  }

  agregarImagen() {
    const imagenesControl = this.creseForm.get('creseImagenes') as FormArray;
    imagenesControl.push(this.fb.group({
      id: [''], // Si es un nuevo registro, no tendrá ID
      imagenUrl: ['', Validators.required],
    }));
  }
  

  eliminarImagen(index: number) {
    const imagenesControl = this.creseForm.get('creseImagenes') as FormArray;
    const imagenId = imagenesControl.at(index).get('id')?.value;

    if (imagenId) {
      this.creseImagenesService.eliminarCreseImagen(imagenId).subscribe({
        next: () => {
          imagenesControl.removeAt(index);
        },
        error: (error) => {
          console.error('Error al eliminar imagen:', error);
        }
      });
    } else {
      imagenesControl.removeAt(index); // Eliminar si no hay ID (nuevo registro)
    }
  }

  guardarImagen(imagenForm: FormGroup) {
    const imagenId = imagenForm.get('id')?.value;
    const imagenData = imagenForm.value;
  
    if (imagenId) {
      // Actualizar imagen existente
      this.creseImagenesService.actualizarCreseImagen(imagenId, imagenData).subscribe({
        next: () => {
          console.log('Imagen actualizada correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar imagen:', error);
        }
      });
    } else {
      // Crear nueva imagen (opcional, en caso de necesitarlo)
      this.creseImagenesService.crearCreseImagen(imagenData).subscribe({
        next: () => {
          console.log('Imagen creada correctamente');
        },
        error: (error) => {
          console.error('Error al crear imagen:', error);
        }
      });
    }
  }
  
}
