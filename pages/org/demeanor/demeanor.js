// pages/org/demeanor/demeanor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['机构环境','课堂风采'],
    selected: 0,
    selectedquyu:0,
    id:null,
    ipUrl:null,
    type:1,
    picturesList:[]
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
      var type = that.data.type
      that.loadImage(type)
  },
  loadImage:function(type){
    var that = this
    var type = type
    app.http('api/institution/pictures', {
      institution_id: that.data.id,
      type:type
    }, "GET")
    .then(res => {
      that.setData({
        picturesList:res.data
      })
      console.log(res,'dadasdas')
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
        type:1
      })
      var type = that.data.type
      that.loadImage(type)
    }else if( index == 1) {
      that.setData({
        selected: 1,
        type:2
      })
      var type = that.data.type
      that.loadImage(type)
    }
  },
  goIndex:function(){
    wx.redirectTo({
      url: '../org?id='+this.data.id
    })
  },
  goCurriculum:function(){
    wx.redirectTo({
      url: '../curriculum/curriculum?id='+this.data.id
    })
  },
  goDemeanor:function(){
    wx.redirectTo({
      url: '../demeanor/demeanor?id='+this.data.id
    })
  },
  goComment:function(){
    wx.redirectTo({
      url: '../comment/comment?id='+this.data.id
    })
  },
  goTeacher:function(){
    wx.redirectTo({
      url: '../teacherList/teacherList?id='+this.data.id
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