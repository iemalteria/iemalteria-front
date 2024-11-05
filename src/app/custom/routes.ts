export const routes = [
    { path: 'home', name: "Inicio", icon: "home", requiresToken: false, general: true, allowedRoles: [] },
    { path: 'conocenos', name: "Conocenos", icon: "group", requiresToken: false, general: true, allowedRoles: [] },
    { path: 'administrar', name: "Administrar", icon: "admin_panel_settings", requiresToken: true, general: false, allowedRoles: ["Administrador"] },
    { path: 'login', name: "Iniciar Sesion", icon: "login", requiresToken: false, general: false, allowedRoles: [] },
    { path: 'registro', name: "Registrarse", icon: "person_add", requiresToken: false, general: false, allowedRoles: [] },
    { path: 'inicio', name: "Blogs", icon: "article", requiresToken: false, general: true, allowedRoles: [] },
    { path: 'crear-blog', name: "Crear blog", icon: "create", requiresToken: true, general: false, allowedRoles: ["Administrador", "Docente", "Estudiante"] },
    { path: 'categoria-blog', name: "Categorias", icon: "category", requiresToken: true, general: false, allowedRoles: ["Administrador", "Docente"] },
    { path: 'empleados', name: "Planta de personal", icon: "people", requiresToken: true, general: false, allowedRoles: ["Administrador"] },
    { path: 'tienda', name: "Emprendimientos", icon: "shop", requiresToken: false, general: true, allowedRoles: [] },
    { path: 'tienda-productos', name: "Productos", icon: "inventory", requiresToken: true, general: false, allowedRoles: ["Administrador"] },
    { path: 'logout', name: "Cerrar sesion", icon: "logout", requiresToken: true, general: false, allowedRoles: [] },
];
