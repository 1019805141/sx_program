// pages/family/details/details.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    controls: true,
    showModalStatus: false,
    id: null,
    content: {},
    controls: true,
    name: '父母课堂音频播放',
    ipUrl: null,
    text: null,
    value: null,
   
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id,
      ipUrl: app.globalData.ipUrl
    })
    that.loadContent()
  },
  loadContent: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/parents/post/detail', {
        id: that.data.id
      }, "GET")
      .then(res => {
        console.log(res)
        var dataList = res.data[0].appraise

        if (dataList.length > 0) {
          dataList.map(function (e) {
            if(e.user.avatar ==null || e.user.avatar ==""){
            }else{
              var s = e.user.avatar.substr(0,1)
              if(s =='h'){
               e.user.zz='1'
              }else{
               e.user.zz='2'
              }
            }
          })
        }

        that.setData({
          content: res.data[0],
          list:res.data[0].radio
        })
        wx.hideLoading()
      })
  },
  forText: function (e) {
    var text = e.detail.value
    this.setData({
      text: e.detail.value
    })
  },
  submit: function () {
    var that = this
    if (that.data.text == null || that.data.text == '') {
      wx.showToast({
        title: '请填写留言内容',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/parents/post/appraise', {
        token: wx.getStorageSync('openid'),
        post_id: that.data.id,
        content: that.data.text
      }, "POST")
      .then(res => {
    

        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 2000,
          success:function(){
            setTimeout(function () {
              //要延时执行的代码
              that.setData({
                value: '',
                showModalStatus: false
              })
              that.loadContent()
            }, 1500) //延迟时间
          }
        })

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
                    url: '../../index/index'
                  })
                })
              }, 1000) //延迟时间
            }
          })
        }
       

        wx.hideLoading()
      })
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
    var that = this;

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

  },
 
})