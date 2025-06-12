// question-list.js
Page({
  data: {
    categoryData: {},
    questionList: [],
    filteredQuestions: [],
    currentFilter: 'all',
    refreshing: false,
    loading: false,
    hasMore: true,
    completedCount: 0,
    collectedCount: 0,
    accuracyRate: 85
  },

  onLoad(options) {
    const { categoryId, categoryName } = options;
    if (categoryId) {
      this.loadCategoryData(categoryId, categoryName);
      this.loadQuestionList(categoryId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 加载分类数据
  loadCategoryData(categoryId, categoryName) {
    const categoryMap = {
      '1': { icon: '📊', name: '算法基础' },
      '2': { icon: '🏗️', name: '数据结构' },
      '3': { icon: '💻', name: '前端开发' },
      '4': { icon: '⚙️', name: '后端开发' },
      '5': { icon: '🗄️', name: '数据库' },
      '6': { icon: '🏛️', name: '系统设计' }
    };

    const categoryData = categoryMap[categoryId] || { 
      icon: '📝', 
      name: categoryName || '题目列表' 
    };

    this.setData({ categoryData });
  },

  // 加载题目列表
  loadQuestionList(categoryId) {
    // 模拟题目数据
    const mockQuestions = [
      {
        id: 1,
        number: 1,
        title: '两数之和',
        difficulty: 'easy',
        difficultyText: '简单',
        tags: ['数组', '哈希表'],
        isCollected: false,
        isCompleted: true,
        acceptanceRate: 52.1
      },
      {
        id: 2,
        number: 15,
        title: '三数之和',
        difficulty: 'medium',
        difficultyText: '中等',
        tags: ['数组', '双指针', '排序'],
        isCollected: true,
        isCompleted: false,
        acceptanceRate: 32.4
      },
      {
        id: 3,
        number: 53,
        title: '最大子数组和',
        difficulty: 'easy',
        difficultyText: '简单',
        tags: ['数组', '动态规划', '分治'],
        isCollected: false,
        isCompleted: true,
        acceptanceRate: 54.9
      },
      {
        id: 4,
        number: 121,
        title: '买卖股票的最佳时机',
        difficulty: 'easy',
        difficultyText: '简单',
        tags: ['数组', '动态规划'],
        isCollected: true,
        isCompleted: true,
        acceptanceRate: 57.2
      },
      {
        id: 5,
        number: 206,
        title: '反转链表',
        difficulty: 'easy',
        difficultyText: '简单',
        tags: ['递归', '链表'],
        isCollected: false,
        isCompleted: false,
        acceptanceRate: 72.4
      },
      {
        id: 6,
        number: 5,
        title: '最长回文子串',
        difficulty: 'medium',
        difficultyText: '中等',
        tags: ['字符串', '动态规划'],
        isCollected: true,
        isCompleted: true,
        acceptanceRate: 36.5
      },
      {
        id: 7,
        number: 23,
        title: '合并K个升序链表',
        difficulty: 'hard',
        difficultyText: '困难',
        tags: ['链表', '分治', '堆（优先队列）', '归并排序'],
        isCollected: false,
        isCompleted: false,
        acceptanceRate: 58.2
      },
      {
        id: 8,
        number: 42,
        title: '接雨水',
        difficulty: 'hard',
        difficultyText: '困难',
        tags: ['栈', '数组', '双指针', '动态规划', '单调栈'],
        isCollected: false,
        isCompleted: false,
        acceptanceRate: 59.6
      }
    ];

    this.setData({
      questionList: mockQuestions,
      filteredQuestions: mockQuestions
    });

    this.calculateStats();
  },

  // 计算统计信息
  calculateStats() {
    const { questionList } = this.data;
    const completedCount = questionList.filter(q => q.isCompleted).length;
    const collectedCount = questionList.filter(q => q.isCollected).length;
    
    this.setData({
      completedCount,
      collectedCount
    });
  },

  // 筛选切换
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    const { questionList } = this.data;
    
    let filteredQuestions = questionList;
    if (filter !== 'all') {
      filteredQuestions = questionList.filter(q => q.difficulty === filter);
    }

    this.setData({
      currentFilter: filter,
      filteredQuestions
    });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true });
    
    // 模拟刷新延迟
    setTimeout(() => {
      this.setData({ 
        refreshing: false 
      });
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

  // 页面显示时更新数据
  onShow() {
    this.updateQuestionStatus();
  },

  // 更新题目状态（收藏、完成状态）
  updateQuestionStatus() {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const history = wx.getStorageSync('history') || [];
      
      const { questionList } = this.data;
      const updatedQuestions = questionList.map(question => {
        const isCollected = collections.some(item => item.id === question.id);
        const isCompleted = history.some(item => item.id === question.id && item.isCorrect);
        
        return {
          ...question,
          isCollected,
          isCompleted
        };
      });

      this.setData({
        questionList: updatedQuestions,
        filteredQuestions: this.filterQuestions(updatedQuestions, this.data.currentFilter)
      });

      this.calculateStats();
    } catch (error) {
      console.error('更新题目状态失败:', error);
    }
  },

  // 根据筛选条件过滤题目
  filterQuestions(questions, filter) {
    if (filter === 'all') {
      return questions;
    }
    return questions.filter(q => q.difficulty === filter);
  }
});
