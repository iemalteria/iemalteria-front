import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import jsPDF from 'jspdf'; // Importar jsPDF
import { EmailService } from '../../services/email.service'; // Importar el servicio de correo
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ProductoImagenes } from '../../interfaces/productoImagenes';
import { ProductoImagenesService } from '../../services/producto-imagenes.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [MatMenuModule, MatToolbarModule, MatButtonModule, MatCardModule, MenuComponent, CommonModule, MatIconModule, MatSidenavModule, MatFormFieldModule, FormsModule],
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
})
export class TiendaComponent implements OnInit, AfterViewInit {
  @ViewChild('carritoSidenav') carritoSidenav!: MatSidenav;
  productosFiltrados: Producto[] = [];
  carrito: Producto[] = [];
  isSidenavOpen: boolean = false; // Variable para controlar el estado de la sidenav
  totalPrecio: number = 0; // Propiedad para almacenar el total del carrito
  nombreCliente: string = '';
  celularCliente: string = '';
  mensajeCliente: string = '';
 
  productoImages: { [key: number]: ProductoImagenes[] } = {}; // Almacena imágenes por ID de Crese
  imagenActual: { [key: number]: number } = {}; // Almacena el índice de la imagen actual para cada Crese

  private emailService = inject(EmailService); // Inyectar el servicio de correo

  constructor(private dialog: MatDialog,private productosService: ProductosService, private carritoService: CarritoService, private productoImagenesService: ProductoImagenesService) {}

  ngOnInit(): void {
    this.mostrarTodosLosProductos(); // Mostrar todos los productos al iniciar
    this.mostrarCarrito();
  }
  isGenerarFacturaDisabled(): boolean {
    return this.carrito.length === 0 || 
           !this.nombreCliente || 
           !this.celularCliente || 
           !this.mensajeCliente;
  }

  ngAfterViewInit(): void {
    // Ahora podemos usar carritoSidenav después de que la vista haya sido inicializada
  }

  generarFactura(): void {
    const doc = new jsPDF();
  
    // Título de la factura
    doc.setFontSize(20);
    doc.text('Factura', 10, 10);
    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15); // Línea divisoria
  
    // Información del cliente
    doc.setFontSize(12);
    doc.text(`Nombre: ${this.nombreCliente}`, 10, 25);
    doc.text(`Celular: ${this.celularCliente}`, 10, 35);
    doc.text(`Mensaje: ${this.mensajeCliente}`, 10, 45);
    doc.line(10, 50, 200, 50); // Línea divisoria
  
    // Encabezados de la tabla de productos
    doc.setFontSize(14);
    doc.text('ID', 10, 60);
    doc.text('Nombre', 40, 60);
    doc.text('Precio', 140, 60);
    doc.line(10, 63, 200, 63); // Línea divisoria
  
    // Inicializa el total y la posición vertical
    let totalPrecio = 0;
    let yPosition = 70;
  
    // Detalles de los productos
    this.carrito.forEach(producto => {
      doc.setFontSize(12);
      doc.text(`${producto.id}`, 10, yPosition);
      doc.text(`${producto.nombre}`, 40, yPosition);
      doc.text(`${producto.precio.toFixed(2)} COP`, 140, yPosition);
      totalPrecio += producto.precio;
      yPosition += 10;
    });
  
    // Mostrar el total
    doc.setFontSize(14);
    doc.line(10, yPosition + 5, 200, yPosition + 5); // Línea divisoria
    doc.text(`Total: ${totalPrecio.toFixed(2)} COP`, 10, yPosition + 15);
  
    // Generar el PDF como Blob
    const pdfBlob = doc.output('blob');
    const archivoPdf = new File([pdfBlob], 'factura.pdf', { type: 'application/pdf' });
  
    // Usar el servicio de correo para enviar el archivo
    this.emailService.enviarCorreoConPdf('roperomalteria@gmail.com', `Sistema de separado - ${this.nombreCliente}`, 'Adjuntamos la factura de la próxima compra.', archivoPdf).subscribe(
      (response) => console.log('Correo enviado con éxito:', response),
      (error) => console.error('Error al enviar el correo:', error)
    );
  
    doc.save(`factura  - ${this.nombreCliente}.pdf`);
  }
  
  
  calcularTotal(): void {
    this.totalPrecio = this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  abrirCarrito() {
    if(!this.isSidenavOpen){
    this.carritoSidenav.open();
    this.isSidenavOpen = true; // Cambia el estado al abrir
    }
    else
    {
      this.carritoSidenav.close();
    this.isSidenavOpen = false; // Cambia el estado al cerrar
    }
  }

  mostrarCarrito(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal(); 
  }

  eliminarDelCarrito(producto: Producto): void {
    this.carritoService.eliminarDelCarrito(producto);
    this.mostrarCarrito(); // Actualiza el carrito mostrado
    this.calcularTotal(); 
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
    console.log('Producto añadido al carrito:', producto);
    this.calcularTotal(); 
  }

  mostrarTodosLosProductos(): void {
    this.productosService.lista().subscribe(
      (response) => {
        this.productosFiltrados = response.value; // Asumiendo que la respuesta contiene un array de productos
        this.productosFiltrados.forEach(producto => {
        this.cargarImagenes(producto.id);
          this.imagenActual[producto.id] = 0; // Inicializa el índice de la imagen actual en 0
        });
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  filtrarProductos(categoria: string, tipo: string): void {
    this.productosService.lista().subscribe(
      (response) => {
        this.productosFiltrados = response.value.filter(
          (producto) => producto.categoria === categoria && producto.tipo === tipo
        );
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  siguienteImagen(productoId: number): void {
    if (this.productoImages[productoId]?.length) {
      this.imagenActual[productoId] = (this.imagenActual[productoId] + 1) % this.productoImages[productoId].length;
    }
  }

  anteriorImagen(productoId: number): void {
    if (this.productoImages[productoId]?.length) {
      this.imagenActual[productoId] = (this.imagenActual[productoId] - 1 + this.productoImages[productoId].length) % this.productoImages[productoId].length;
    }
  }

  cargarImagenes(productoId: number): void {
    this.productoImagenesService.obtenerProductoImagenPorProductoId(productoId).subscribe({
      next: (response) => {
        this.productoImages[productoId] = response.value;
      },
      error: (err) => {
        console.error(`Error loading images for Crese ID ${productoId}`, err);
      }
    });
  }
  mostrarVideo(url: string) {
    if(url)
    {
    this.dialog.open(VideoDialogComponent, {
      data: { videoUrl: url },
      width: '600px'
    });
  }
  }


}
