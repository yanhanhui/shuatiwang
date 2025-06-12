// history.js
Page({
  data: {
    history: [],
    filteredHistory: [],
    groupedHistory: [],
    currentFilter: 'all',
    refreshing: false,
    totalCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    accuracyRate: 0,
    showActionModal: false,
    selectedRecord: {}
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    try {
      const history = wx.getStorageSync('history') || [];
      const collections = wx.getStorageSync('collections') || [];
      
      // 格式化历史数据，添加收藏状态
      const formattedHistory = history.map(item => {
        const isCollected = collections.some(c => c.id === item.id);
        return {
          ...item,
          isCollected
        };
      });

      // 计算统计数据
      const totalCount = formattedHistory.length;
      const correctCount = formattedHistory.filter(item => item.isCorrect).length;
      const incorrectCount = totalCount - correctCount;
      const accuracyRate = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      this.setData({
        history: formattedHistory,
        totalCount,
        correctCount,
        incorrectCount,
        accuracyRate
      });

      this.applyFilter();
    } catch (error) {
      console.error('加载历史记录失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 筛选切换
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.applyFilter();
  },

  // 应用筛选
  applyFilter() {
    let { history, currentFilter } = this.data;
    
    // 筛选
    let filtered = history;
    if (currentFilter === 'correct') {
      filtered = history.filter(item => item.isCorrect);
    } else if (currentFilter === 'incorrect') {
      filtered = history.filter(item => !item.isCorrect);
    }

    this.setData({ filteredHistory: filtered });
    this.groupByDate(filtered);
  },

  // 按日期分组
  groupByDate(records) {
    const groups = {};
    
    records.forEach(record => {
      // 解析时间字符串
      let date;
      if (record.viewedAt) {
        date = new Date(record.viewedAt);
      } else if (record.answerTime) {
        date = new Date(record.answerTime);
      } else {
        date = new Date();
      }
      
      const dateStr = this.formatDate(date);
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(record);
    });

    // 转换为数组并排序
    const groupedArray = Object.keys(groups)
      .sort((a, b) => this.compareDates(b, a)) // 最新的在前
      .map(date => ({
        date: date,
        records: groups[date].sort((a, b) => {
          // 同一天内按时间倒序
          const timeA = a.viewedAt || a.answerTime || new Date().toISOString();
          const timeB = b.viewedAt || b.answerTime || new Date().toISOString();
          return new Date(timeB) - new Date(timeA);
        })
      }));

    this.setData({ groupedHistory: groupedArray });
  },

  // 格式化日期
  formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (dateStr === todayStr) {
      return '今天';
    } else if (dateStr === yesterdayStr) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  // 比较日期字符串
  compareDates(a, b) {
    const priority = { '今天': 2, '昨天': 1 };
    const priorityA = priority[a] || 0;
    const priorityB = priority[b] || 0;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return a.localeCompare(b);
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true });
    
    setTimeout(() => {
      this.loadHistory();
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

  // 显示操作菜单
  onShowActionMenu(e) {
    const record = e.currentTarget.dataset.record;
    this.setData({
      selectedRecord: record,
      showActionModal: true
    });
  },

  // 关闭操作菜单
  onCloseActionModal() {
    this.setData({
      showActionModal: false,
      selectedRecord: {}
    });
  },

  // 查看题目
  onViewQuestion() {
    const { selectedRecord } = this.data;
    this.onCloseActionModal();
    
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${selectedRecord.id}`
    });
  },

  // 切换收藏状态
  onToggleCollect() {
    const { selectedRecord } = this.data;
    const newCollectedStatus = !selectedRecord.isCollected;
    
    this.toggleCollection(selectedRecord.id, newCollectedStatus);
    this.onCloseActionModal();
  },

  // 切换收藏
  toggleCollection(questionId, isCollected) {
    try {
      const collections = wx.getStorageSync('collections') || [];
      
      if (isCollected) {
        // 添加到收藏
        const { selectedRecord } = this.data;
        const exists = collections.find(item => item.id === questionId);
        if (!exists) {
          collections.push({
            id: selectedRecord.id,
            title: selectedRecord.title,
            difficulty: selectedRecord.difficulty,
            difficultyText: selectedRecord.difficultyText,
            collectedAt: new Date().toISOString()
          });
          wx.setStorageSync('collections', collections);
        }
      } else {
        // 从收藏中移除
        const filteredCollections = collections.filter(item => item.id !== questionId);
        wx.setStorageSync('collections', filteredCollections);
      }

      // 重新加载数据
      this.loadHistory();
      
      wx.showToast({
        title: isCollected ? '已收藏' : '已取消收藏',
        icon: 'success'
      });
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 删除记录
  onDeleteRecord() {
    const { selectedRecord } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条答题记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteHistoryRecord(selectedRecord.id);
        }
      }
    });
    
    this.onCloseActionModal();
  },

  // 删除历史记录
  deleteHistoryRecord(questionId) {
    try {
      const history = wx.getStorageSync('history') || [];
      const filteredHistory = history.filter(item => !(item.id === questionId && item.viewedAt === this.data.selectedRecord.viewedAt));
      
      wx.setStorageSync('history', filteredHistory);
      
      // 重新加载数据
      this.loadHistory();
      
      wx.showToast({
        title: '已删除记录',
        icon: 'success'
      });
    } catch (error) {
      console.error('删除记录失败:', error);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },

  // 清空历史记录
  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有答题记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('history');
            this.loadHistory();
            wx.showToast({
              title: '已清空记录',
              icon: 'success'
            });
          } catch (error) {
            console.error('清空记录失败:', error);
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 去题库
  goToQuestionBank() {
    wx.switchTab({
      url: '/pages/question-bank/question-bank'
    });
  }
});
