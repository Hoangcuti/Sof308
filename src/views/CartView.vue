<template>
  <div class="cart-view container mt-4">
    <router-link v-if="!isOrderSuccess" to="/" class="back-btn">
        <i class="fas fa-arrow-left"></i> Quay lại
    </router-link>
    
    <div v-if="!isOrderSuccess">
        <h2 class="mb-4">GIỎ HÀNG</h2>
        
        <table v-if="store.cart.length > 0" id="cart-table">
          <thead>
            <tr>
              <th style="width: 15%;">Ảnh</th>
              <th style="width: 50%;">Tên sản phẩm</th>
              <th style="width: 20%;">Giá</th>
              <th style="width: 15%;">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in store.cart" :key="index">
              <td><img :src="item.image" :alt="item.name"></td>
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td>
                <button class="btn-premium btn-premium-outline btn-sm px-3 py-2" @click="store.removeFromCart(index)">
                    <i class="fas fa-trash"></i> Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- EMPTY CART STATE -->
        <div v-else class="text-center py-5 border rounded bg-white shadow-sm">
            <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p class="text-muted">Hãy chọn những sản phẩm tuyệt vời nhất của chúng tôi.</p>
            <router-link to="/" class="btn btn-dark px-4 py-2 mt-2">XEM SẢN PHẨM</router-link>
        </div>
        
        <div v-if="store.cart.length > 0" class="info-checkout mt-4 pb-5">
            <div class="checkout-form mt-4 p-4 border rounded shadow-sm bg-light text-start">
                <h3 class="mb-3 border-bottom pb-2 font-oswald">Thông Tin Thanh Toán</h3>
                
                <div class="row mb-3">
                    <div class="col-md-4 mb-3 text-start">
                        <label for="fullName" class="form-label fw-bold">Họ và tên:</label>
                        <input type="text" id="fullName" class="form-control" v-model="fullName" placeholder="Nhập họ tên...">
                    </div>
                    <div class="col-md-4 mb-3 text-start">
                        <label for="phone" class="form-label fw-bold">Số điện thoại:</label>
                        <input type="tel" id="phone" class="form-control" v-model="phone" placeholder="Nhập số điện thoại...">
                    </div>
                    <div class="col-md-4 mb-3 text-start">
                        <label for="email" class="form-label fw-bold">Email:</label>
                        <input type="email" id="email" class="form-control" v-model="email" placeholder="Nhập email...">
                    </div>
                </div>

                <div class="mb-3 text-start">
                    <label class="form-label d-block fw-bold">Phương thức nhận hàng:</label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="home" v-model="deliveryMethod" id="homeDelivery">
                        <label class="form-check-label" for="homeDelivery">Giao hàng tận nơi</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="pickup" v-model="deliveryMethod" id="pickup">
                        <label class="form-check-label" for="pickup">Đến tận nơi lấy hàng (Miễn phí)</label>
                    </div>
                </div>

                <div v-if="deliveryMethod === 'home'" class="mb-3 text-start">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label for="address" class="form-label fw-bold mb-0">Địa chỉ nhận hàng:</label>
                        <button class="btn-premium btn-premium-outline btn-sm px-3 py-2" @click="getLocation">
                            <i class="fas fa-location-arrow"></i> Lấy vị trí để tính phí
                        </button>
                    </div>
                    <textarea id="address" class="form-control mb-2" v-model="address" placeholder="Nhập địa chỉ..."></textarea>
                    <small v-if="distance > 0" class="text-success d-block">
                        Khoảng cách dự kiến: <strong>{{ distance.toFixed(1) }} km</strong>
                    </small>
                </div>

                <div class="mb-3 text-start">
                    <label class="form-label d-block fw-bold">Phương thức thanh toán:</label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="cod" v-model="paymentMethod" id="paymentCod">
                        <label class="form-check-label" for="paymentCod">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="qr" v-model="paymentMethod" id="paymentQr">
                        <label class="form-check-label" for="paymentQr">Chuyển khoản / Quét mã QR</label>
                    </div>
                </div>

                <div v-if="paymentMethod === 'qr'" class="qr-payment-box p-3 mb-3 border rounded bg-white text-center">
                    <p class="fw-bold mb-2">Quét mã để thanh toán</p>
                    <img src="/qr-payment.jpg" alt="QR Code" class="img-fluid mb-2" style="width: 250px;">
                    <p class="small text-muted mb-0">Nội dung: <strong>{{ fullName }} - LV</strong></p>
                </div>

                <div v-if="deliveryMethod === 'pickup'" class="alert alert-info py-2">
                    <i class="fas fa-info-circle"></i> Bạn sẽ nhận được <strong>Mã nhận hàng</strong> qua Email sau khi xác nhận.
                </div>

                <div class="summary-details border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between">
                        <span>Tạm tính:</span>
                        <span>{{ subtotalFormatted }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Phí vận chuyển:</span>
                        <span :class="{'text-danger': deliveryMethod === 'home' && distance === 0}">
                            {{ deliveryMethod === 'home' && distance === 0 ? 'Chưa tính phí' : shippingFeeFormatted }}
                        </span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold fs-4 mt-2 border-top pt-2">
                        <span>Tổng tiền:</span>
                        <span class="text-primary">{{ grandTotalFormatted }}</span>
                    </div>
                </div>

                <button class="btn-premium btn-premium-dark w-100 mt-3 d-flex justify-content-center align-items-center py-3" 
                        @click="handleCheckout" 
                        :disabled="isSendingEmail">
                    <span v-if="isSendingEmail" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSendingEmail ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN THANH TOÁN' }}
                </button>
            </div>

            <!-- Enhanced: Order Tracking in Cart Section -->
            <div v-if="store.isLoggedIn && store.orders.length > 0" class="order-tracking-section mt-5 p-4 border rounded shadow-sm bg-white">
                <div class="d-flex align-items-center mb-4 border-bottom pb-2">
                    <i class="fas fa-truck-moving me-2 text-primary fs-4"></i>
                    <h3 class="mb-0 font-oswald text-uppercase">Theo dõi đơn hàng</h3>
                </div>

                <div class="row">
                    <div v-for="order in store.orders" :key="order.Id" class="col-md-6 mb-4">
                        <div class="order-card p-3 border rounded h-100 bg-light shadow-sm">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-bold text-dark">Mã đơn: #{{ order.Id }}</span>
                                <span class="badge px-3 py-2" :class="getStatusBadgeClass(order.Status)">
                                    <i v-if="order.Status === 'Pending'" class="fas fa-clock me-1"></i>
                                    <i v-if="order.Status === 'Shipping'" class="fas fa-truck me-1"></i>
                                    <i v-if="order.Status === 'Delivered'" class="fas fa-check-circle me-1"></i>
                                    <i v-if="order.Status === 'Cancelled'" class="fas fa-times-circle me-1"></i>
                                    {{ order.Status === 'Pending' ? 'Chờ duyệt' : 
                                       order.Status === 'Shipping' ? 'Đang giao' : 
                                       order.Status === 'Delivered' ? 'Thành công' : 'Đã hủy' }}
                                </span>
                            </div>

                            <!-- Tracking Progress Bar -->
                            <div v-if="order.Status !== 'Cancelled'" class="tracking-progress mb-4 px-2">
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-success" role="progressbar" 
                                        :style="{ width: order.Status === 'Pending' ? '33%' : (order.Status === 'Shipping' ? '66%' : '100%') }">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between mt-2 small text-muted">
                                    <span :class="{'fw-bold text-dark': order.Status === 'Pending'}">Chờ duyệt</span>
                                    <span :class="{'fw-bold text-dark': order.Status === 'Shipping'}">Đang giao</span>
                                    <span :class="{'fw-bold text-dark': order.Status === 'Delivered'}">Thành công</span>
                                </div>
                            </div>
                            
                            <div class="order-items-mini mb-3">
                                <p class="small fw-bold text-muted mb-2 text-uppercase">Sản phẩm đã mua:</p>
                                <div v-for="item in order.items" :key="item.Id" class="d-flex align-items-center mb-2 bg-white p-2 rounded border">
                                    <img :src="item.Image" alt="" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded shadow-sm">
                                    <div class="flex-grow-1 overflow-hidden">
                                        <div class="small text-truncate fw-semibold">{{ item.ProductName }}</div>
                                        <div class="text-primary smaller fw-bold">{{ item.Price }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                <div class="small">
                                    <div class="text-muted">Hình thức: {{ order.PaymentMethod.toUpperCase() }}</div>
                                    <div class="text-muted smaller">Ngày: {{ new Date(order.OrderDate).toLocaleDateString() }}</div>
                                </div>
                                <div class="text-end">
                                    <div class="small text-muted">Tổng cộng</div>
                                    <div class="fs-5 fw-bold text-danger">{{ order.Total }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SUCCESS VIEW -->
    <div v-else class="order-success-container text-center py-5">
        <div class="success-icon mb-4">
            <i class="fas fa-check-circle fa-5x text-success bounce"></i>
        </div>
        <h2 class="text-success fw-bold font-oswald text-uppercase">Đặt hàng thành công!</h2>
        <p class="lead text-muted">Cảm ơn <strong>{{ fullName }}</strong>, đơn hàng của bạn đã được xác nhận.</p>
        
        <div class="email-sent-alert mx-auto p-3 mb-4 rounded border">
            <i class="fas fa-envelope-open-text text-primary"></i> 
            Một email xác nhận đã được gửi đến <strong>{{ email }}</strong>
        </div>

        <div v-if="lastOrderInfo.pickupCode" class="pickup-code-box mx-auto p-4 mb-4 rounded shadow-sm bg-white border">
            <p class="mb-1 text-muted">MÃ NHẬN HÀNG TẠI CỬA HÀNG</p>
            <h1 class="display-4 fw-bold text-dark font-monospace">{{ lastOrderInfo.pickupCode }}</h1>
            <small class="text-danger">* Vui lòng trình mã này với nhân viên để lấy hàng</small>
        </div>

        <div class="order-summary-box text-start mx-auto p-4 mb-4 rounded border bg-white shadow-sm" style="max-width: 500px;">
            <h5 class="border-bottom pb-2 mb-3 font-oswald">Chi tiết đơn hàng</h5>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Phương thức:</span>
                <span class="fw-bold">{{ deliveryMethod === 'home' ? 'Giao hàng tận nơi' : 'Đến lấy tại cửa hàng' }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Thanh toán:</span>
                <span class="fw-bold">{{ lastOrderInfo.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản / QR' }}</span>
            </div>
            <div v-if="deliveryMethod === 'home'" class="d-flex justify-content-between mb-2">
                <span class="text-muted">Địa chỉ:</span>
                <span class="fw-bold text-end">{{ address }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Số điện thoại:</span>
                <span class="fw-bold">{{ phone }}</span>
            </div>
            <div class="d-flex justify-content-between mt-3 pt-2 border-top">
                <span class="fs-5">Tổng cộng:</span>
                <span class="fs-5 fw-bold text-primary">{{ lastOrderTotal }}</span>
            </div>
        </div>

        <button class="btn-premium btn-premium-dark px-5 py-3 mt-3" @click="resetView">TIẾP TỤC MUA SẮM</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store } from '../store';
import { useRouter } from 'vue-router';

const router = useRouter();

const deliveryMethod = ref('home');
const address = ref('');
const fullName = ref('');
const phone = ref('');
const email = ref('');
const distance = ref(0);
const isOrderSuccess = ref(false);
const isSendingEmail = ref(false);
const lastOrderTotal = ref('');
const paymentMethod = ref('cod');
const lastOrderInfo = ref({ pickupCode: null, paymentMethod: 'cod' });

const STORE_COORDS = { lat: 21.0285, lng: 105.8542 };

const subtotal = computed(() => {
  let total = 0;
  if (store.cart) {
    store.cart.forEach(item => {
      const priceNum = parseInt(item.price.replace(/\./g, '').replace(' ₫', '')) || 0;
      total += priceNum;
    });
  }
  return total;
});

const subtotalFormatted = computed(() => subtotal.value.toLocaleString() + ' ₫');

const shippingFee = computed(() => {
    if (deliveryMethod.value === 'pickup') return 0;
    if (distance.value === 0) return 30000;
    const calculated = Math.round(distance.value * 10000);
    return Math.max(calculated, 15000);
});

const shippingFeeFormatted = computed(() => shippingFee.value.toLocaleString() + ' ₫');

const grandTotalFormatted = computed(() => {
    return (subtotal.value + shippingFee.value).toLocaleString() + ' ₫';
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const getLocation = () => {
    if (!navigator.geolocation) {
        alert("Trình duyệt không hỗ trợ định vị.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            distance.value = calculateDistance(position.coords.latitude, position.coords.longitude, STORE_COORDS.lat, STORE_COORDS.lng);
        },
        () => alert("Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.")
    );
};

const generatePickupCode = () => 'LV-' + Math.random().toString(36).substr(2, 6).toUpperCase();

const handleCheckout = () => {
    if (!fullName.value.trim() || !phone.value.trim() || !email.value.trim()) {
        alert('Vui lòng nhập đầy đủ Họ tên, SĐT và Email!');
        return;
    }

    if (deliveryMethod.value === 'home' && !address.value.trim()) {
        alert('Vui lòng nhập địa chỉ nhận hàng!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        alert('Email không hợp lệ!');
        return;
    }

    if (confirm('Xác nhận đặt hàng và gửi thông tin về email của bạn?')) {
        isSendingEmail.value = true;
        
        const orderId = Date.now().toString();
        const orderData = {
            id: orderId,
            userId: store.currentUser ? store.currentUser.id : null,
            fullName: fullName.value,
            phone: phone.value,
            email: email.value,
            address: deliveryMethod.value === 'home' ? address.value : 'Lấy tại cửa hàng',
            deliveryMethod: deliveryMethod.value,
            paymentMethod: paymentMethod.value,
            total: grandTotalFormatted.value,
            pickupCode: deliveryMethod.value === 'pickup' ? generatePickupCode() : null
        };

        const orderItems = store.cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image
        }));

        store.createOrder(orderData, orderItems).then(() => {
            lastOrderTotal.value = grandTotalFormatted.value;
            lastOrderInfo.value = { 
                pickupCode: orderData.pickupCode, 
                paymentMethod: paymentMethod.value 
            };
            
            isSendingEmail.value = false;
            isOrderSuccess.value = true;
            store.clearCart();
        }).catch(err => {
            alert('Lỗi khi thanh toán: ' + err.message);
            isSendingEmail.value = false;
        });
    }
};

const resetView = () => {
    isOrderSuccess.value = false;
    fullName.value = '';
    phone.value = '';
    email.value = '';
    address.value = '';
    distance.value = 0;
    paymentMethod.value = 'cod';
    lastOrderInfo.value.pickupCode = null;
    router.push('/');
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-warning text-dark';
        case 'Shipping': return 'bg-info text-dark';
        case 'Delivered': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
};
</script>

<style scoped>
.cart-view {
  font-family: 'Roboto Flex', sans-serif;
  max-width: 1200px;
  padding-bottom: 50px;
}

.font-oswald {
    font-family: 'Oswald', sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}

th {
  background: #f5f5f5;
  font-weight: bold;
  text-transform: uppercase;
}

img {
  width: 100px;
  height: auto;
  border-radius: 4px;
}

.remove-btn {
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.remove-btn:hover {
    background-color: #a00000;
}

.back-btn {
  display: inline-block;
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #303030;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: 'Oswald', sans-serif;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #555;
}

.checkout-form {
    background: #fdfdfd;
}

.checkout-btn {
    background-color: #000;
    color: #fff;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.checkout-btn:hover:not(:disabled) {
    background-color: #333;
}

.checkout-btn:disabled {
    background-color: #666;
    cursor: not-allowed;
}

.email-sent-alert {
    max-width: 500px;
    background-color: #e3f2fd;
    color: #0d47a1;
}

.pickup-code-box {
    max-width: 500px;
    border: 2px dashed #000;
}

.bounce {
    animation: bounce 1s ease infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.order-success-container {
    background: #f8f9fa;
    border-radius: 12px;
    margin-top: 20px;
}
.order-history-section, .order-tracking-section {
    background: #fff;
    border: 1px solid #eee;
}

.order-card {
    transition: transform 0.2s;
    border-left: 4px solid #3498db !important;
}

.order-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
}

.order-items-mini img {
    border: 1px solid #ddd;
}

.tracking-progress .progress {
    background-color: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
}

.smaller {
    font-size: 0.75rem;
}

.badge {
    font-weight: 600;
    letter-spacing: 0.5px;
}
</style>
