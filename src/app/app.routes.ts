import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { authGuard } from './custom/auth.guard';
import { BlogDetallesComponent } from './pages/blog-detalles/blog-detalles.component';
import { CrearBlogComponent } from './pages/crear-blog/crear-blog.component';
import { HomeComponent } from './pages/home/home.component';
import { AdministrarComponent } from './pages/administrar/administrar.component';
import { TextosWebDetallesComponent } from './pages/textos-web-detalles/textos-web-detalles.component';
import { ConocenosComponent } from './pages/conocenos/conocenos.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { EmpleadoCrearComponent } from './pages/empleado-crear/empleado-crear.component';
import { EmpleadoDetallesComponent } from './pages/empleado-detalles/empleado-detalles.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { TiendaProductosComponent } from './pages/tienda-productos/tienda-productos.component';
import { ProductoCrearComponent } from './pages/producto-crear/producto-crear.component';
import { ProductoDetallesComponent } from './pages/producto-detalles/producto-detalles.component';


export const routes: Routes = [
    {
        path:"",component:HomeComponent
    },
    {
        path:"login", component:LoginComponent
    },
    {
        path:"logout", component:LoginComponent, canActivate:[authGuard]
    },
    {
        path:"registro",component:RegistroComponent
    },
    {
        path:"inicio",component:InicioComponent, canActivate:[authGuard],
    },
    {
        path:"blog-detalles/:id",component:BlogDetallesComponent, canActivate:[authGuard],
    },
    {
        path:"crear-blog",component:CrearBlogComponent, canActivate:[authGuard]
    },
    {
        path:"home",component:HomeComponent, 
    },
    {
        path:"administrar", component:AdministrarComponent, canActivate:[authGuard]
    },
    {
        path:"textos-web-detalles/:id",component:TextosWebDetallesComponent, canActivate:[authGuard]
    },
    {
        path:"conocenos",component:ConocenosComponent,
    },
    {
        path:"empleados",component:EmpleadosComponent, canActivate:[authGuard]
    },
    {
        path:"empleado-crear", component:EmpleadoCrearComponent, canActivate:[authGuard]
    },
    {
        path:"empleado-detalles/:id", component:EmpleadoDetallesComponent, canActivate:[authGuard]
    },
    {
        path:"tienda", component: TiendaComponent
    },
    {
        path:"tienda-productos", component: TiendaProductosComponent, canActivate:[authGuard]
    },
    {
        path:"producto-crear", component:ProductoCrearComponent, canActivate:[authGuard]
    },
    {
        path:"producto-detalles/:id", component:ProductoDetallesComponent, canActivate:[authGuard]
    },
];
