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
import { CreseComponent } from './pages/crese/crese.component';
import { CreseDetallesComponent } from './pages/crese-detalles/crese-detalles.component';
import { CreseCrearComponent } from './pages/crese-crear/crese-crear.component';
import { CategoriaBlogComponent } from './pages/categoria-blog-crear/categoria-blog.component';
import { CategoriaBlogListarComponent } from './pages/categoria-blog-listar/categoria-blog-listar.component';
import { CategoriaBlogDetallesComponent } from './pages/categoria-blog-detalles/categoria-blog-detalles.component';
import { BlogCategoriaComponent } from './pages/blog-categoria/blog-categoria.component';
import { UsuariosDetallesComponent } from './pages/usuarios-detalles/usuarios-detalles.component';
import { AdministrarBlogsComponent } from './pages/administrar-blogs/administrar-blogs.component';
import { EditarBlogComponent } from './pages/editar-blog/editar-blog.component';


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
        path:"inicio",component:InicioComponent, 
    },
    {
        path:"blog-detalles/:id",component:BlogDetallesComponent, 
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
    {
        path:"crese", component:CreseComponent, canActivate:[authGuard]
    },
    {
        path:"crese-detalles/:id", component: CreseDetallesComponent, canActivate:[authGuard]
    },
    {
        path:"crese-crear", component: CreseCrearComponent, canActivate:[authGuard]
    },
    {
        path:"categoria-blog-crear", component: CategoriaBlogComponent, canActivate:[authGuard]
    },
    {
        path:"categoria-blog", component: CategoriaBlogListarComponent, canActivate:[authGuard]
    },
    {
        path:"categoria-blog-detalles/:id", component: CategoriaBlogDetallesComponent, canActivate:[authGuard]
    },
    {
        path:"blog-categoria/:id", component: BlogCategoriaComponent
    },
    {
        path:"usuarios-detalles/:id", component: UsuariosDetallesComponent, canActivate:[authGuard]
    },
    {
        path:"administrar-blogs", component: AdministrarBlogsComponent, canActivate:[authGuard]
    },
    {
        path:"editar-blog/:id", component:EditarBlogComponent, canActivate:[authGuard]
    }

];
