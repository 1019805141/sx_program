// pages/index/cashDetail/cashDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    ipUrl:null,
    content:null,
    controls: true,
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.id,
      ipUrl:app.globalData.ipUrl
    })
    that.loadContent()
  },

  loadContent:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/discount/detail', {
      type: 2,
      id: that.data.id,
      token: wx.getStorageSync('openid')
    }, "GET")
    .then(res => {
      if(res.status_code == 401){
        wx.showToast({
          title: '登录超时，重新登录中..',
          duration: 2000,
          icon: 'none',
          success(data) {
            setTimeout(function () {
              app.http('api/refresh', {
                token: wx.getStorageSync('openid')
              }, "POST").then(res => {
                wx.setStorageSync('openid', res.data.token)
                wx.switchTab({
                  url: '../index'
                })
              })
            }, 1000) //延迟时间
          }
        })
      }
      that.setData({
        content:res.data
      })
      wx.hideLoading()
    })
  },

  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例  
    var animation = wx.createAnimation({
      duration: 300, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  powerDrawer: function (e) {
    var that = this
    var currentStatu = e.currentTarget.dataset.statu;
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    if (status == 0) {
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/discount/draw', {
          type: 2,
          discount_id: id,
          token: wx.getStorageSync('openid')
        }, "POST")
        .then(res => {
          if(res.status_code == 401){
            wx.showToast({
              title: '登录超时，重新登录中..',
              duration: 2000,
              icon: 'none',
              success(data) {
                setTimeout(function () {
                  app.http('api/refresh', {
                    token: wx.getStorageSync('openid')
                  }, "POST").then(res => {
                    wx.setStorageSync('openid', res.data.token)
                    wx.switchTab({
                      url: '../index'
                    })
                  })
                }, 1000) //延迟时间
              }
            })
          }
          if (res.status_code == 200) {
            that.util(currentStatu)
          }
          wx.hideLoading()
        })
    } else {
      return
    }

  },
  select: function () {
    this.setData({
      showModalStatus: false
    });
    this.loadContent()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})