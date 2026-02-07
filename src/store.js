import { reactive, watch } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const store = reactive({
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    isLoggedIn: !!JSON.parse(localStorage.getItem('currentUser')),
    users: [],
    products: [],
    posts: [],
    orders: [],

    notification: {
        show: false,
        message: '',
        type: 'success'
    },

    // Initial data fetch
    async init() {
        try {
            const [prodRes, postRes, userRes] = await Promise.all([
                axios.get(`${API_URL}/products`),
                axios.get(`${API_URL}/posts`),
                axios.get(`${API_URL}/users`)
            ])
            this.products = prodRes.data
            this.posts = postRes.data
            this.users = userRes.data

            if (this.isLoggedIn) {
                this.fetchUserOrders(this.currentUser.id);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu từ server:', error)
        }
    },

    // --- ORDERS ---
    async fetchOrders() {
        try {
            const res = await axios.get(`${API_URL}/orders`);
            this.orders = res.data;
        } catch (error) {
            console.error('Lỗi khi tải danh sách đơn hàng:', error);
        }
    },

    async fetchUserOrders(userId) {
        try {
            const res = await axios.get(`${API_URL}/users/${userId}/orders`);
            this.orders = res.data;
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng của người dùng:', error);
        }
    },

    async createOrder(orderData, items) {
        try {
            const res = await axios.post(`${API_URL}/orders`, { order: orderData, items });
            if (this.isLoggedIn) {
                this.fetchUserOrders(this.currentUser.id);
            }
            return res.data;
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            throw error;
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            await axios.patch(`${API_URL}/orders/${orderId}`, { status });
            this.fetchOrders();
            this.showNotification('Đã cập nhật trạng thái đơn hàng!');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    },

    showNotification(message, type = 'success') {
        this.notification.message = message;
        this.notification.type = type;
        this.notification.show = true;
        setTimeout(() => {
            this.notification.show = false;
        }, 3000);
    },

    // --- AUTH ---
    async register(userData) {
        try {
            const res = await axios.post(`${API_URL}/users`, {
                ...userData,
                id: Date.now()
            })
            const newUser = res.data
            this.users.push(newUser)
            this.login(newUser)
            return newUser
        } catch (error) {
            console.error('Lỗi đăng ký:', error)
            throw error
        }
    },

    login(user) {
        this.currentUser = user
        this.isLoggedIn = true
        localStorage.setItem('currentUser', JSON.stringify(user))
        this.fetchUserOrders(user.id);
    },

    loginWithSocial(platform) {
        // Simulate a social login fetching user data
        const dummyUser = {
            id: Date.now(),
            username: `${platform}_user`,
            name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
            email: `user@${platform}.com`,
            role: 'user',
            image: platform === 'google'
                ? 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'
                : 'https://cdn-icons-png.flaticon.com/512/124/124010.png'
        }
        this.login(dummyUser)
        this.showNotification(`Đã đăng nhập bằng ${platform.charAt(0).toUpperCase() + platform.slice(1)} thành công!`)
    },

    logout() {
        this.currentUser = null
        this.isLoggedIn = false
        localStorage.removeItem('currentUser')
    },

    async updateUser(updatedData) {
        try {
            const res = await axios.patch(`${API_URL}/users/${this.currentUser.id}`, updatedData)
            this.currentUser = { ...this.currentUser, ...res.data }
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser))

            // Sync users list
            const index = this.users.findIndex(u => u.id === this.currentUser.id)
            if (index !== -1) this.users[index] = this.currentUser

            this.showNotification('Cập nhật thông tin thành công!')
        } catch (error) {
            console.error('Lỗi cập nhật user:', error)
            throw error
        }
    },

    // --- PRODUCTS ---
    async addProduct(product) {
        try {
            const res = await axios.post(`${API_URL}/products`, product)
            this.products.push(res.data)
            this.showNotification('Thêm sản phẩm thành công!')
        } catch (error) {
            console.error('Lỗi thêm sản phẩm:', error)
        }
    },

    async updateProduct(product) {
        try {
            const res = await axios.put(`${API_URL}/products/${product.id}`, product)
            const index = this.products.findIndex(p => p.id === product.id)
            if (index !== -1) this.products[index] = res.data
            this.showNotification('Cập nhật sản phẩm thành công!')
        } catch (error) {
            console.error('Lỗi cập nhật sản phẩm:', error)
        }
    },

    async deleteProduct(id) {
        try {
            await axios.delete(`${API_URL}/products/${id}`)
            this.products = this.products.filter(p => p.id !== id)
            this.showNotification('Đã xóa sản phẩm!')
        } catch (error) {
            console.error('Lỗi xóa sản phẩm:', error)
        }
    },

    // --- POSTS ---
    async addPost(post) {
        try {
            const res = await axios.post(`${API_URL}/posts`, post)
            this.posts.unshift(res.data)
            this.showNotification('Đã đăng bài viết! Chờ duyệt.')
        } catch (error) {
            console.error('Lỗi thêm bài viết:', error)
        }
    },

    async approvePost(post) {
        try {
            const res = await axios.patch(`${API_URL}/posts/${post.id}`, { status: 'approved' })
            const p = this.posts.find(x => x.id === post.id)
            if (p) {
                p.status = 'approved'
                this.showNotification('Đã duyệt bài viết!')
            }
        } catch (error) {
            console.error('Lỗi duyệt bài:', error)
        }
    },

    async deletePost(id) {
        try {
            await axios.delete(`${API_URL}/posts/${id}`)
            this.posts = this.posts.filter(p => p.id !== id)
            this.showNotification('Đã xóa bài viết!')
        } catch (error) {
            console.error('Lỗi xóa bài:', error)
        }
    },

    async addComment(post, comment) {
        try {
            const updatedComments = [...post.comments, comment]
            const res = await axios.patch(`${API_URL}/posts/${post.id}`, { comments: updatedComments })
            const p = this.posts.find(x => x.id === post.id)
            if (p) p.comments = res.data.comments
        } catch (error) {
            console.error('Lỗi thêm bình luận:', error)
        }
    },

    // --- CART ---
    addToCart(product) {
        this.cart.push(product)
        this.showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1)
    },

    clearCart() {
        this.cart = []
    }
});

// Sync cart to localStorage
watch(
    () => store.cart,
    value => {
        localStorage.setItem('cart', JSON.stringify(value))
    },
    { deep: true }
)