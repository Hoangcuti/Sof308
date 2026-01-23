import { reactive, watch } from 'vue';

const cartData = JSON.parse(localStorage.getItem('cart')) || [];
const userData = JSON.parse(localStorage.getItem('currentUser')) || null;
const productsData = JSON.parse(localStorage.getItem('products')) || [
    // Home / T-Shirts (Featured)
    { id: 1, name: 'Áo Thun', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-embroidered-signature-t-shirt--HTY21WNPG900_PM2_Front%20view.png?wid=730&hei=730', price: '99.000.000 ₫', category: 'featured' },
    { id: 2, name: 'Phụ Kiện Treo Túi LV Shell', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-shell-bag-charm--M02620_PM2_Front%20view.png?wid=730&hei=730', price: '99.000.000 ₫', category: 'featured' },
    { id: 3, name: 'Túi Speedy Bandoulière 30', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-speedy-30-bandouliere--M14457_PM2_Front%20view.png?wid=730&hei=730', price: '99.000.000 ₫', category: 'featured' },
    { id: 4, name: 'Giày Thể Thao LV Footprint Soccer', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-footprint-soccer--BTU00ZSC20_PM2_Front%20view.png?wid=730&hei=730', price: '99.000.000 ₫', category: 'featured' },

    // Túi Xách (tuixach)
    { id: 11, name: 'Túi Hills Pochette', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-hills-pochette--M14304_PM2_Front%20view.png?wid=490&hei=490', price: '51.500.000 ₫', category: 'tuixach' },
    { id: 12, name: 'Túi Vanity Chain Pouch', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-vanity-chain-pouch--M14303_PM2_Front%20view.png?wid=730&hei=730', price: '65.500.000 ₫', category: 'tuixach' },
    { id: 13, name: 'Túi OnTheGo MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-tui-onthego-mm--M13189_PM2_Front%20view.png?wid=490&hei=490', price: '93.500.000 ₫', category: 'tuixach' },
    { id: 14, name: 'Túi Neverfull MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lock-and-walk--M24638_PM2_Front%20view.png?wid=490&hei=490', price: '78.000.000 ₫', category: 'tuixach' },
    { id: 15, name: 'Túi Pochette Metis', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-pochette-metis--M45923_PM2_Front%20view.png?wid=490&hei=490', price: '85.000.000 ₫', category: 'tuixach' },
    { id: 16, name: 'Túi Speedy Bandoulière 25', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-speedy-bandouliere-25--M41526_PM2_Front%20view.png?wid=490&hei=490', price: '62.500.000 ₫', category: 'tuixach' },
    { id: 17, name: 'Túi Néonoé BB', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-neonoe-bb--M46581_PM2_Front%20view.png?wid=730&hei=730', price: '55.500.000 ₫', category: 'tuixach' },
    { id: 18, name: 'Túi Hide Away MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-hide-away-mm--M14473_PM2_Front%20view.png?wid=730&hei=730', price: '120.000.000 ₫', category: 'tuixach' },
    { id: 19, name: 'Túi Pochette Camille', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-pochette-camille--M13566_PM2_Front%20view.png?wid=730&hei=730', price: '40.500.000 ₫', category: 'tuixach' },
    { id: 20, name: 'Túi Noé BB', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-noe-bb--M40818_PM2_Front%20view.png?wid=490&hei=490', price: '75.000.000 ₫', category: 'tuixach' },
    { id: 21, name: 'Túi Pochette Accessoires', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-pochette-accessoires--M82766_PM2_Front%20view.png?wid=730&hei=730', price: '41.500.000 ₫', category: 'tuixach' },
    { id: 22, name: 'Túi Speedy Soft 30 Dark', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-speedy-soft-30-dark--M12243_PM2_Front%20view.png?wid=730&hei=730', price: '87.000.000 ₫', category: 'tuixach' },

    // Giày (giaydep)
    { id: 31, name: 'Giày Thể Thao LV Trainer', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-giay-the-thao-lv-trainer--BM9U5PMI02_PM2_Front%20view.png?wid=490&hei=490', price: '35.000.000 ₫', category: 'giaydep' },
    { id: 32, name: 'Giày Thể Thao LV Trainer (Đen)', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-giay-the-thao-lv-trainer--BM9U5PMI54_PM2_Front%20view.png?wid=490&hei=490', price: '35.000.000 ₫', category: 'giaydep' },
    { id: 33, name: 'Giày Thể Thao LV Trainer (Xám)', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-trainer-sneaker--BSUPMUGC01_PM2_Front%20view.png?wid=490&hei=490', price: '35.000.000 ₫', category: 'giaydep' },
    { id: 34, name: 'Giày Thể Thao LV Classic', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-trainer-sneaker--BTU015NU20_PM2_Front%20view.png?wid=730&hei=730', price: '30.500.000 ₫', category: 'giaydep' },

    // Mũ (mu)
    { id: 41, name: 'Mũ Lưỡi Trai Signature', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-signature-cap--M5149L_PM2_Front%20view.png?wid=730&hei=730', price: '15.100.000 ₫', category: 'mu' },
    { id: 42, name: 'Mũ Lưỡi Trai Only LV', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-only-lv-cap--M7956L_PM2_Front%20view.png?wid=730&hei=730', price: '12.900.000 ₫', category: 'mu' },
    { id: 43, name: 'Mũ Lưỡi Trai Họa Tiết Monogram', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-monogram-essential-cap--M76584_PM2_Front%20view.png?wid=730&hei=730', price: '20.200.000 ₫', category: 'mu' },
    { id: 44, name: 'Mũ LV Smash', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-smash-rain-cap--M7714M_PM2_Front%20view.png?wid=730&hei=730', price: '15.100.000 ₫', category: 'mu' },

    // Thắt lưng (thatluong)
    { id: 51, name: 'Thắt Lưng Hai Mặt LV Flower 40MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-flower-40mm-reversible-belt--M4253U_PM2_Front%20view.png?wid=730&hei=730', price: '19.400.000 ₫', category: 'thatluong' },
    { id: 52, name: 'Thắt Lưng Hai Mặt LV Dimension 30MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-dimension-30mm-reversible-belt--M4049U_PM2_Front%20view.png?wid=1440&hei=1440', price: '15.700.000 ₫', category: 'thatluong' },
    { id: 53, name: 'Thắt Lưng Hai Mặt LV Dimension 30MM (Vàng)', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-dimension-30mm-reversible-belt--M4048U_PM2_Front%20view.png?wid=600&hei=600', price: '15.700.000 ₫', category: 'thatluong' },
    { id: 54, name: 'Thắt Lưng Hai Mặt LV Dimension Gradient 40MM', image: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-dimension-gradient-40mm-reversible-belt--M4068T_PM2_Front%20view.png?wid=600&hei=600', price: '18.300.000 ₫', category: 'thatluong' },
];

export const store = reactive({
    cart: cartData,
    currentUser: userData,
    isLoggedIn: !!userData,
    products: productsData,
    posts: JSON.parse(localStorage.getItem('posts')) || [
        { id: 1, title: 'Bộ sưu tập Mùa Thu 2025', content: 'Khám phá những mẫu thiết kế mới nhất vừa ra mắt...', author: 'Admin', date: '2025-01-15', image: 'https://vn.louisvuitton.com/content/dam/lv/online/picture/asiapacific/2025/Women_Prefall_Odyssey_DI3.jpg?wid=600', comments: [], showComments: false, newCommentText: '', status: 'approved' },
        { id: 2, title: 'Phong cách doanh nhân', content: 'Lựa chọn trang phục phù hợp cho các quý ông...', author: 'Admin', date: '2025-01-16', image: '', comments: [], showComments: false, newCommentText: '', status: 'approved' }
    ],

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    },

    login(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
    },

    addToCart(product) {
        this.cart.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        alert('Đã thêm vào giỏ hàng: ' + product.name);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    },

    addProduct(product) {
        this.products.push(product);
        this.saveProducts();
    },

    updateProduct(product) {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            this.products[index] = product;
            this.saveProducts();
        }
    },

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
    },

    // Post Actions
    addPost(post) {
        this.posts.unshift(post);
        this.savePosts();
    },

    approvePost(post) {
        const p = this.posts.find(x => x.id === post.id);
        if (p) {
            p.status = 'approved';
            this.savePosts();
        }
    },

    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id);
        this.savePosts();
    },

    addComment(post, comment) {
        const p = this.posts.find(x => x.id === post.id);
        if (p) {
            if (!p.comments) p.comments = [];
            p.comments.push(comment);
            this.savePosts();
        }
    }
});
