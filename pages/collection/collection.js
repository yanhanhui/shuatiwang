// collection.js
Page({
  data: {
    collections: [],
    filteredCollections: [],
    currentFilter: 'all',
    currentSort: 'time', // time: 按时间排序, title: 按标题排序
    sortText: '按时间排序',
    refreshing: false,
    completedCount: 0
  },

  onLoad() {
    this.loadCollections();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadCollections();
  },

  // 加载收藏数据
  loadCollections() {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const history = wx.getStorageSync('history') || [];
      
      // 格式化收藏数据
      const formattedCollections = collections.map(item => {
        const isCompleted = history.some(h => h.id === item.id && h.isCorrect);
        const collectedDate = item.collectedAt ? new Date(item.collectedAt) : new Date();
        
        return {
          ...item,
          isCompleted,
          collectedTime: this.formatTime(collectedDate)
        };
      });

      // 计算已完成数量
      const completedCount = formattedCollections.filter(item => item.isCompleted).length;

      this.setData({
        collections: formattedCollections,
        completedCount
      });

      this.applyFilter();
    } catch (error) {
      console.error('加载收藏数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 格式化时间
  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
  },

  // 筛选切换
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.applyFilter();
  },

  // 排序切换
  onSortChange() {
    const newSort = this.data.currentSort === 'time' ? 'title' : 'time';
    const sortText = newSort === 'time' ? '按时间排序' : '按标题排序';
    
    this.setData({
      currentSort: newSort,
      sortText
    });
    
    this.applyFilter();
  },

  // 应用筛选和排序
  applyFilter() {
    let { collections, currentFilter, currentSort } = this.data;
    
    // 筛选
    let filtered = collections;
    if (currentFilter !== 'all') {
      filtered = collections.filter(item => item.difficulty === currentFilter);
    }

    // 排序
    if (currentSort === 'time') {
      filtered.sort((a, b) => {
        const timeA = a.collectedAt ? new Date(a.collectedAt) : new Date();
        const timeB = b.collectedAt ? new Date(b.collectedAt) : new Date();
        return timeB - timeA; // 最新的在前
      });
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.setData({ filteredCollections: filtered });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true });
    
    setTimeout(() => {
      this.loadCollections();
      this.setData({ refreshing: false });
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 题目点击
  onQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${question.id}`
    });
  },

  // 移除收藏
  onRemoveCollection(e) {
    const questionId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这道题目吗？',
      success: (res) => {
        if (res.confirm) {
          this.removeFromCollection(questionId);
        }
      }
    });
  },

  // 从收藏中移除
  removeFromCollection(questionId) {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const filteredCollections = collections.filter(item => item.id !== questionId);
      
      wx.setStorageSync('collections', filteredCollections);
      
      // 重新加载数据
      this.loadCollections();
      
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } catch (error) {
      console.error('移除收藏失败:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 去题库
  goToQuestionBank() {
    wx.switchTab({
      url: '/pages/question-bank/question-bank'
    });
  }
});
