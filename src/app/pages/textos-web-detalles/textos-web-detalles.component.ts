import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextowebService } from '../../services/textoweb.service';
import { textoweb } from '../../interfaces/textoweb';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../custom/menu/menu.component';

@Component({
  selector: 'app-textos-web-detalles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './textos-web-detalles.component.html',
  styleUrls: ['./textos-web-detalles.component.css']
})
export class TextosWebDetallesComponent implements OnInit {
  private textowebService = inject(TextowebService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  public form: FormGroup;
  public textoWeb!: textoweb;
  public id:number;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      seccion: ['', Validators.required],
      texto: ['', Validators.required],
      imagenUrl: [''],
      altText: [''],
      titulo: ['', Validators.required]
    });
    this.id=0;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTextoWeb(id);
      this.id=id;
    }
  }

  loadTextoWeb(id: number): void {
    this.textowebService.obtenerTextowebPorId(id).subscribe({
      next: (data) => {
        this.textoWeb = data;
        this.form.patchValue(data);
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.value.Id=this.id;
      this.textowebService.actualizarTextoweb(this.id,this.form.value).subscribe({
        next: () => {
          this.router.navigate(['administrar']);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }
  }
}
