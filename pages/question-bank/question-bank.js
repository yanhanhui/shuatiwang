// question-bank.js
Page({
  data: {
    searchText: '',
    categories: [
      {
        id: 1,
        name: '算法基础',
        icon: '📊',
        count: 120,
        type: 'algorithm'
      },
      {
        id: 2,
        name: '数据结构',
        icon: '🏗️',
        count: 88,
        type: 'data-structure'
      },
      {
        id: 3,
        name: '前端开发',
        icon: '💻',
        count: 156,
        type: 'frontend'
      },
      {
        id: 4,
        name: '后端开发',
        icon: '⚙️',
        count: 93,
        type: 'backend'
      },
      {
        id: 5,
        name: '数据库',
        icon: '🗄️',
        count: 67,
        type: 'database'
      },
      {
        id: 6,
        name: '系统设计',
        icon: '🏛️',
        count: 45,
        type: 'system-design'
      }
    ],
    recentQuestions: [
      {
        id: 1,
        title: '两数之和',
        difficulty: 'easy',
        difficultyText: '简单',
        isCollected: true,
        isCompleted: true
      },
      {
        id: 2,
        title: '三数之和',
        difficulty: 'medium',
        difficultyText: '中等',
        isCollected: false,
        isCompleted: false
      },
      {
        id: 3,
        title: '最长回文子串',
        difficulty: 'medium',
        difficultyText: '中等',
        isCollected: true,
        isCompleted: true
      }
    ]
  },

  onLoad() {
    this.loadRecentQuestions();
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  // 搜索按钮点击
  onSearch() {
    const { searchText } = this.data;
    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到搜索结果页面（这里模拟跳转到题目列表页面）
    wx.navigateTo({
      url: `/pages/question-list/question-list?categoryId=search&categoryName=搜索结果&keyword=${encodeURIComponent(searchText)}`
    });
  },

  // 分类点击
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `/pages/question-list/question-list?categoryId=${category.id}&categoryName=${category.name}`
    });
  },

  // 题目点击
  onQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${question.id}`
    });
  },

  // 加载最近练习的题目
  loadRecentQuestions() {
    // TODO: 从本地存储或服务器获取最近练习的题目
    console.log('加载最近练习题目');
  }
});
