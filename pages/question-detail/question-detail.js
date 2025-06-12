// question-detail.js
Page({
  data: {
    questionData: {},
    showSolution: false,
    questionId: null
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ questionId: id });
      this.loadQuestionData(id);
    } else {
      wx.showToast({
        title: '题目不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 加载题目数据
  loadQuestionData(questionId) {
    // 模拟题目数据，实际项目中应该从服务器获取
    const mockQuestions = {
      '1': {
        id: 1,
        title: '两数之和',
        difficulty: 'easy',
        difficultyText: '简单',
        isCollected: false,
        description: `
          <p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值</strong> <code>target</code> 的那 <strong>两个</strong> 整数，并返回它们的数组下标。</p>
          <p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>
          <p>你可以按任意顺序返回答案。</p>
        `,
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: ''
          },
          {
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            explanation: ''
          }
        ],
        hints: [
          '一个简单的实现是使用两层 for 循环遍历数组，时间复杂度为 O(n²)',
          '我们可以使用哈希表来降低时间复杂度到 O(n)',
          '在遍历数组时，检查目标值与当前元素的差是否存在于哈希表中'
        ],
        constraints: [
          '2 ≤ nums.length ≤ 10⁴',
          '-10⁹ ≤ nums[i] ≤ 10⁹',
          '-10⁹ ≤ target ≤ 10⁹',
          '只会存在一个有效答案'
        ],
        solution: {
          approach: `
            <p><strong>方法一：哈希表</strong></p>
            <p>最容易想到的方法是枚举数组中的每一个数 x，寻找数组中是否存在 target - x。</p>
            <p>当我们使用遍历整个数组的方式寻找 target - x 时，需要注意到每一个位于 x 之前的元素都已经和 x 匹配过，因此不需要再进行匹配。而每一个元素不能被使用两次，所以我们只需要在 x 后面的元素中寻找 target - x。</p>
          `,
          code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
          complexity: `
            <p><strong>时间复杂度：</strong>O(n)，其中 n 是数组中的元素数量。对于每一个元素 x，我们可以 O(1) 地寻找 target - x。</p>
            <p><strong>空间复杂度：</strong>O(n)，其中 n 是数组中的元素数量。主要为哈希表的开销。</p>
          `
        }
      },
      '2': {
        id: 2,
        title: '三数之和',
        difficulty: 'medium',
        difficultyText: '中等',
        isCollected: true,
        description: `
          <p>给你一个包含 n 个整数的数组 <code>nums</code>，判断 <code>nums</code> 中是否存在三个元素 <em>a，b，c ，</em>使得 <em>a + b + c = </em>0 ？请你找出所有和为 0 且不重复的三元组。</p>
          <p><strong>注意：</strong>答案中不可以包含重复的三元组。</p>
        `,
        examples: [
          {
            input: 'nums = [-1,0,1,2,-1,-4]',
            output: '[[-1,-1,2],[-1,0,1]]',
            explanation: ''
          },
          {
            input: 'nums = []',
            output: '[]',
            explanation: ''
          },
          {
            input: 'nums = [0]',
            output: '[]',
            explanation: ''
          }
        ],
        hints: [
          '先对数组进行排序',
          '使用双指针技巧避免重复计算',
          '注意去重处理'
        ],
        constraints: [
          '0 ≤ nums.length ≤ 3000',
          '-10⁵ ≤ nums[i] ≤ 10⁵'
        ],
        solution: {
          approach: `
            <p><strong>方法：排序 + 双指针</strong></p>
            <p>本题的难点在于如何去除重复解。</p>
            <p>算法流程：</p>
            <ol>
              <li>特判，对于数组长度 n，如果数组为 null 或者数组长度小于 3，返回 []</li>
              <li>对数组进行排序</li>
              <li>遍历排序后数组：</li>
            </ol>
          `,
          code: `function threeSum(nums) {
    const result = [];
    const n = nums.length;
    
    if (n < 3) return result;
    
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = n - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}`,
          complexity: `
            <p><strong>时间复杂度：</strong>O(n²)，其中 n 是数组 nums 的长度。</p>
            <p><strong>空间复杂度：</strong>O(1)。我们只需要常数的空间存放若干变量。</p>
          `
        }
      }
    };

    const questionData = mockQuestions[questionId];
    if (questionData) {
      this.setData({ questionData });
    } else {
      wx.showToast({
        title: '题目数据加载失败',
        icon: 'none'
      });
    }
  },

  // 切换收藏状态
  onToggleCollect() {
    const { questionData } = this.data;
    const newCollectedStatus = !questionData.isCollected;
    
    this.setData({
      'questionData.isCollected': newCollectedStatus
    });

    // 保存到本地存储
    this.saveCollectionStatus(newCollectedStatus);

    wx.showToast({
      title: newCollectedStatus ? '已收藏' : '已取消收藏',
      icon: 'success'
    });
  },

  // 保存收藏状态
  saveCollectionStatus(isCollected) {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const { questionData } = this.data;
      
      if (isCollected) {
        // 添加到收藏
        const exists = collections.find(item => item.id === questionData.id);
        if (!exists) {
          collections.push({
            id: questionData.id,
            title: questionData.title,
            difficulty: questionData.difficulty,
            difficultyText: questionData.difficultyText,
            collectedAt: new Date().toISOString()
          });
          wx.setStorageSync('collections', collections);
        }
      } else {
        // 从收藏中移除
        const filteredCollections = collections.filter(item => item.id !== questionData.id);
        wx.setStorageSync('collections', filteredCollections);
      }
    } catch (error) {
      console.error('保存收藏状态失败:', error);
    }
  },

  // 显示解答
  onShowSolution() {
    this.setData({ showSolution: true });
  },

  // 关闭解答弹窗
  onCloseSolution() {
    this.setData({ showSolution: false });
  },

  // 开始答题
  onStartAnswer() {
    const { questionData } = this.data;
    
    // 记录到历史记录
    this.saveToHistory();
    
    wx.showModal({
      title: '开始答题',
      content: '此功能正在开发中，敬请期待！',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 保存到历史记录
  saveToHistory() {
    try {
      const history = wx.getStorageSync('history') || [];
      const { questionData } = this.data;
      
      // 检查是否已存在
      const existingIndex = history.findIndex(item => item.id === questionData.id);
      const historyItem = {
        id: questionData.id,
        title: questionData.title,
        difficulty: questionData.difficulty,
        difficultyText: questionData.difficultyText,
        viewedAt: new Date().toLocaleString(),
        isCorrect: Math.random() > 0.5 // 模拟答题结果
      };
      
      if (existingIndex >= 0) {
        // 更新现有记录
        history[existingIndex] = historyItem;
      } else {
        // 添加新记录到开头
        history.unshift(historyItem);
      }
      
      // 限制历史记录数量
      if (history.length > 100) {
        history.splice(100);
      }
      
      wx.setStorageSync('history', history);
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }
});
