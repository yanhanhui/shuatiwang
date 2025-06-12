// app.js
App({
  onLaunch() {
    // 初始化应用
    console.log('刷题王小程序启动');
    
    // 检查更新
    this.checkForUpdate();
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功，code:', res.code);
      }
    });
  },

  onShow() {
    // 小程序显示时触发
    console.log('小程序显示');
  },

  onHide() {
    // 小程序隐藏时触发
    console.log('小程序隐藏');
  },

  // 检查小程序更新
  checkForUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }
  },

  globalData: {
    userInfo: null,
    // 题库数据（实际项目中应该从服务器获取）
    questionCategories: [
      { id: 1, name: '算法基础', count: 120 },
      { id: 2, name: '数据结构', count: 88 },
      { id: 3, name: '前端开发', count: 156 },
      { id: 4, name: '后端开发', count: 93 }
    ]
  }
});
