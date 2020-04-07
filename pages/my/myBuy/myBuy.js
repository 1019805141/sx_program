// pages/my/myBuy/myBuy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['全部','待体验','已完成'],
    selected: 0,
    selectedquyu:0,
    ipUrl:null,
    status:'',
    buyList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ipUrl:app.globalData.ipUrl
    })
    that.loadBuy()
  },
  loadBuy:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/order', {
      token:wx.getStorageSync('openid'),
      status:that.data.status
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
                  url: '../../index/index'
                })
              })
            }, 1000) //延迟时间
          }
        })
      }
      console.log(res,'1232132131')
      that.setData({
        buyList:res.data
      })
      wx.hideLoading()
    })
  },
  selected: function (e) {
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if( index == 0){  
      that.setData({
        selected: 0,
        status:''
      })
      that.loadBuy()
    }else if( index == 1) {
      that.setData({
        selected: 1,
        status:0
      })
      that.loadBuy()
    }else if(index == 2 ){
      that.setData({
        selected: 2,
        status:1
      })
      that.loadBuy()
    }
  },
  goDetail:function(e){
    var id = e.currentTarget.dataset.id                       
    wx.navigateTo({
      url: '../myBuyDetail/myBuyDetail?id=' + id
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