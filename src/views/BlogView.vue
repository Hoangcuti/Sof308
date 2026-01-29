<template>
  <div class="blog-view container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-center flex-grow-1">Góc Thời Trang & Bài Viết</h2>
    </div>

    <!-- Post Form -->
    <div class="card mb-4 shadow-sm" v-if="store.isLoggedIn">
      <div class="card-body">
        <h5 class="card-title">Đăng bài viết mới</h5>
        <div class="mb-3">
          <input type="text" class="form-control mb-2" v-model="newPost.title" placeholder="Tiêu đề bài viết...">
          <div class="mb-2">
            <label class="form-label small fw-bold">Ảnh minh họa:</label>
            <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
          </div>
          <div v-if="newPost.image" class="mb-2 position-relative" style="width: 100px;">
            <img :src="newPost.image" alt="Preview" class="img-thumbnail">
            <span @click="newPost.image = ''" class="remove-img">×</span>
          </div>
          <textarea class="form-control" v-model="newPost.content" rows="3" placeholder="Bạn đang nghĩ gì?"></textarea>
        </div>
        <button class="btn btn-dark" @click="addPost">Đăng bài</button>
      </div>
    </div>
    <div v-else class="alert alert-warning text-center">
        Vui lòng đăng nhập để đăng bài.
    </div>

    <!-- Post List -->
    <div v-for="post in approvedPosts" :key="post.id" class="card mb-3 shadow-sm">
        <div class="card-body">
            <h5 class="card-title">{{ post.title }} <small class="text-muted" style="font-size:0.6em">bởi {{ post.author }}</small></h5>
            <img v-if="post.image" :src="post.image" class="img-fluid mb-3 rounded" alt="Post Image" style="max-height: 400px; object-fit: cover;">
            <p class="card-text">{{ post.content }}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="toggleComments(post)">
                        <i class="far fa-comment"></i> Bình luận ({{ post.comments ? post.comments.length : 0 }})
                    </button>
                    <!-- Deletion for Owner or Admin -->
                    <span v-if="store.currentUser && (store.currentUser.username === post.author || store.currentUser.role === 'admin')">
                        <button class="btn btn-sm btn-outline-danger" @click="deletePost(post.id)">Xóa</button>
                    </span>
                </div>
                <small class="text-muted">{{ post.date }}</small>
            </div>

            <!-- Comments -->
            <div v-if="post.showComments" class="comment-section mt-3">
                <div v-for="(comment, cIndex) in post.comments" :key="cIndex" class="comment">
                    <strong>{{ comment.author }}:</strong> {{ comment.text }}
                </div>
                <div class="input-group mt-2" v-if="store.isLoggedIn">
                    <input type="text" class="form-control form-control-sm" placeholder="Viết bình luận..." v-model="post.newCommentText" @keyup.enter="addComment(post)">
                    <button class="btn btn-sm btn-dark" @click="addComment(post)">Gửi</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../store';

const newPost = ref({ title: '', content: '', image: '' });

const approvedPosts = computed(() => {
    return store.posts.filter(p => p.status === 'approved');
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPost.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addPost = () => {
    if (!newPost.value.title || !newPost.value.content) return;
    
    const post = {
        id: Date.now(),
        title: newPost.value.title,
        content: newPost.value.content,
        image: newPost.value.image,
        author: store.currentUser.username,
        date: new Date().toISOString().split('T')[0],
        comments: [],
        showComments: true,
        newCommentText: '',
        status: 'pending' // Pending approval
    };
    
    store.addPost(post);
    newPost.value = { title: '', content: '', image: '' };
    alert('Bài viết đang chờ duyệt!');
}

const toggleComments = (post) => {
    // We cannot mutate prop directly if it came from store, but store objects are reactive.
    // Ideally we'd use a local state map, but for simplicity here we assume store objects are mutable.
    post.showComments = !post.showComments; 
};

const addComment = (post) => {
    if (!post.newCommentText) return;
    const comment = {
        author: store.currentUser.username,
        text: post.newCommentText
    };
    store.addComment(post, comment);
    post.newCommentText = '';
};

const deletePost = (id) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
        store.deletePost(id);
    }
};
</script>

<style scoped>
.remove-img {
    position:absolute; top:-5px; right:-5px; background:red; color:white; border-radius:50%; width:20px; height:20px; text-align:center; line-height:20px; cursor:pointer; font-size:12px;
}
.comment-section { font-family: 'Roboto Flex', sans-serif; margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px; }
.comment { background: #f9f9f9; padding: 5px; margin-bottom: 5px; border-radius: 4px; font-size: 0.9em; }
</style>
