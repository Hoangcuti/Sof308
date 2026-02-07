import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import BlogView from '../views/BlogView.vue'
import CartView from '../views/CartView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue' // Optional, can use Home with modal

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/asm.html', // Redirect legacy
            redirect: '/'
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin.html', // Legacy redirect
            redirect: '/admin'
        },
        {
            path: '/blog',
            name: 'blog',
            component: BlogView
        },
        {
            path: '/blog.html',
            redirect: '/blog'
        },
        {
            path: '/cart',
            name: 'cart',
            component: CartView
        },
        {
            path: '/giohang.html',
            redirect: '/cart'
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView,
            meta: { requiresAuth: true }
        },
        {
            path: '/profile.html',
            redirect: '/profile'
        },
        // Category Routes
        {
            path: '/category/:id',
            name: 'category',
            component: () => import('../views/CategoryView.vue')
        },
        // Legacy redirects
        { path: '/tuixach.html', redirect: '/category/tuixach' },
        { path: '/giaydep.html', redirect: '/category/giaydep' },
        { path: '/mu.html', redirect: '/category/mu' },
        { path: '/thatluong.html', redirect: '/category/thatluong' },

        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/product/:id',
            name: 'product-detail',
            component: () => import('../views/ProductDetailView.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (to.meta.requiresAuth && !user) {
        next('/');
        // Trigger login modal logic if possible, or redirect to login page
        // For now, simple redirect
        alert('Vui lòng đăng nhập!');
    } else if (to.meta.role && user && user.role !== to.meta.role) {
        alert('Không có quyền truy cập!');
        next('/');
    } else {
        next();
    }
});

export default router
