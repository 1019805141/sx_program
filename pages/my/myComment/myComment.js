// pages/my/myComment/myComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['全部','待评价','已评价'],
    selected: 0,
    selectedquyu:0,
    is_appraise:'',
    comment:null,
    ipUrl:null
  },
  selected: function (e) {
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if( index == 0){  
      that.setData({
        selected: 0,
        is_appraise:''
      })
      that.loadComment()
    }else if( index == 1) {
      that.setData({
        selected: 1,
        is_appraise:0
      })
      that.loadComment()
    }else if( index == 2) {
      that.setData({
        selected: 2,
        is_appraise:1
      })
      that.loadComment()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ipUrl:app.globalData.ipUrl
    })
  },
loadComment:function(){
  var that = this
  wx.showLoading({ //显示 loading 提示框
    title: "加载中..."
  })
  app.http('api/user/appraise', {
    token:wx.getStorageSync('openid'),
    is_appraise:that.data.is_appraise,
    status: 0
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
    console.log(res,'dadsadsadasdasd')
    that.setData({
      comment:res.data
    })
    wx.hideLoading()
  })
},
goDetail:function(e){
  console.log(e)
  var type = e.currentTarget.dataset.type
  var id = e.currentTarget.dataset.id
  var order_no =e.currentTarget.dataset.order_no
  var is_appraise = e.currentTarget.dataset.is_appraise
  console.log(e)
  if(is_appraise == 0){
    if(type ==1){
      wx.navigateTo({
        url: '../subComment/subComment?id='+id+'&type=' +type + '&order_no=' + order_no
      })
    }else{
      wx.navigateTo({
        url: '../subComment398/subComment398?id='+id+'&type=' +type + '&order_no=' + order_no
      })
    }
  
  }else{
    if(type ==1){
      wx.navigateTo({
        url: '../myCommentDe/myCommentDe?id='+id+'&type=' +type
      })
    }else{
      wx.navigateTo({
        url: '../myCommentDe398/myCommentDe398?id='+id+'&type=' +type
      })
    }
 
  }
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
    this.loadComment()
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