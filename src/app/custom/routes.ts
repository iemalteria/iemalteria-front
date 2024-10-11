export const routes = [
    {
        path:'home', name:"Inicio", icon:"home", requiresToken:false, general:true,
    },
    {
        path:'conocenos', name:"Conocenos", icon:"group", requiresToken:false, general:true,
    },
    {
        path:'administrar', name:"Administrar", icon: "admin_panel_settings", requiresToken:true, general:false,
    },
    {
        path:'inicio', name:"Blogs", icon: "article", requiresToken: true, general:false,
    },
    {
        path:'crear-blog', name:"Crear blog", icon:"create", requiresToken: true, general:false,
    },
    {
        path:'empleados', name:"Empleados", icon:"people", requiresToken: true, general:false,
    },
    {
        path:'login', name:"Iniciar Sesion", icon:"login", requiresToken: false, general:false,
    },
    {
        path:'registro', name:"Registrarse", icon:"person_add", requiresToken: false, general:false,
    },
    {
        path:'tienda', name:"Tienda", icon:"shop", requiresToken: false, general: true
    },
    {
        path:'tienda-productos', name:"Productos", icon: "inventory", requiresToken: true, general: false
    },
    {
        path:'logout', name:"Cerrar sesion", icon:"logout", requiresToken: true, general:false,
    }
    
    
    
    
]