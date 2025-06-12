// profile.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    
    userStats: {
      totalQuestions: 28,
      correctRate: 85,
      studyDays: 12
    },
    
    collections: [
      {
        id: 1,
        title: '两数之和',
        difficulty: 'easy',
        difficultyText: '简单'
      },
      {
        id: 2,
        title: '最长回文子串',
        difficulty: 'medium',
        difficultyText: '中等'
      },
      {
        id: 3,
        title: '合并K个升序链表',
        difficulty: 'hard',
        difficultyText: '困难'
      },
      {
        id: 4,
        title: '三数之和',
        difficulty: 'medium',
        difficultyText: '中等'
      }
    ],
    
    history: [
      {
        id: 1,
        title: '两数之和',
        answerTime: '2024-12-10 14:30',
        isCorrect: true
      },
      {
        id: 2,
        title: '反转链表',
        answerTime: '2024-12-10 13:45',
        isCorrect: false
      },
      {
        id: 3,
        title: '有效的括号',
        answerTime: '2024-12-09 16:20',
        isCorrect: true
      },
      {
        id: 4,
        title: '最大子数组和',
        answerTime: '2024-12-09 15:10',
        isCorrect: true
      }
    ]
  },

  onLoad() {
    this.loadUserData();
  },

  // 头像选择
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const { nickName } = this.data.userInfo;
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
    this.saveUserInfo();
  },

  // 昵称输入
  onInputChange(e) {
    const nickName = e.detail.value;
    const { avatarUrl } = this.data.userInfo;
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
    this.saveUserInfo();
  },

  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        this.saveUserInfo();
      }
    });
  },

  // 头像点击
  onAvatarTap() {
    if (!this.data.hasUserInfo) {
      this.getUserProfile();
    }
  },

  // 收藏页面
  onCollectionTap() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 历史记录页面
  onHistoryTap() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 题目点击
  onQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${question.id}`
    });
  },

  // 清除数据
  onClearData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            collections: [],
            history: [],
            userStats: {
              totalQuestions: 0,
              correctRate: 0,
              studyDays: 0
            }
          });
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('collections');
          wx.removeStorageSync('history');
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于刷题王',
      content: '刷题王是一款专业的编程题库小程序，帮助你提升编程技能。\n\n版本: 1.0.0\n开发者: 刷题王团队',
      showCancel: false
    });
  },

  // 加载用户数据
  loadUserData() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const collections = wx.getStorageSync('collections');
      const history = wx.getStorageSync('history');
      
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
      }
      
      if (collections) {
        this.setData({
          collections: collections
        });
      }
      
      if (history) {
        this.setData({
          history: history
        });
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  // 保存用户信息
  saveUserInfo() {
    try {
      wx.setStorageSync('userInfo', this.data.userInfo);
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }
});
