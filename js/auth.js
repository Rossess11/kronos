/**
 * KRONOS - AUTENTICACIÓN Y CONTROL DE ACCESO
 * Gestión de sesión, roles (Administrador vs Profesor) y protección estricta.
 */

class AuthService {
  constructor() {
    this.currentUser = window.store.currentUser;
  }

  login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@murciaeduca.es')) {
      return { success: false, message: 'El acceso requiere correo institucional @murciaeduca.es' };
    }
    const user = window.store.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'Usuario no registrado en el sistema' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    this.currentUser = user;
    window.store.currentUser = user;
    window.store.saveToStorage();
    window.store.addAuditLog('LOGIN', 'ACCESO', user.full_name, `Inicio de sesión exitoso como ${user.role.toUpperCase()}`);

    this.updateUserUI();
    return { success: true, user };
  }

  logout() {
    if (this.currentUser) {
      window.store.addAuditLog('LOGOUT', 'SALIDA', this.currentUser.full_name, 'Cierre de sesión');
    }
    this.currentUser = null;
    window.store.currentUser = null;
    window.store.saveToStorage();
    this.showLoginScreen();
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  updateUserUI() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-layout') || document.getElementById('app-container');
    const userNameElem = document.getElementById('topbar-user-name');
    const userRoleElem = document.getElementById('topbar-user-role');
    const userDeptElem = document.getElementById('topbar-user-dept');
    const adminOnlyElements = document.querySelectorAll('.admin-only');

    if (this.currentUser) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';

      // Recuadro Unificado: Nombre, Rol y Departamento integrados
      if (userNameElem) {
        userNameElem.textContent = this.currentUser.full_name;
      }

      if (userRoleElem) {
        userRoleElem.textContent = this.currentUser.role === 'admin' ? 'ADMINISTRADOR' : 'PROFESOR';
        userRoleElem.className = `sb-user-role-tag ${this.currentUser.role}`;
      }

      if (userDeptElem) {
        userDeptElem.textContent = this.currentUser.department || 'Emergencias y Protección Civil';
        userDeptElem.style.display = 'inline-flex';
      }

      // Mostrar u ocultar elementos exclusivos de Administrador (incluyendo configuración Supabase)
      adminOnlyElements.forEach(elem => {
        elem.style.display = this.isAdmin() ? (elem.tagName === 'A' || elem.tagName === 'BUTTON' ? 'flex' : 'block') : 'none';
      });

      // Si el usuario no es admin y está en una vista restringida, redirigir al inventario
      if (!this.isAdmin()) {
        if (window.app && (window.app.currentView === 'teachers' || window.app.currentView === 'settings')) {
          window.app.switchView('inventory');
        }
      }
    } else {
      this.showLoginScreen();
    }
  }

  showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-layout') || document.getElementById('app-container');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
  }
}

window.authService = new AuthService();
