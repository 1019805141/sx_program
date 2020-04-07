// pages/index/courseDetails/audition/audition.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{ id: 1, name: '0-3岁' }, { id: 2, name: '3-6岁' }, { id: 3, name: '6-12岁' }, { id: 4, name: '12-15岁' }, { id: 5, name: '15-18岁' }],
    msg:'',
    id:null,
    institution_id:null,
    token:null,
    detail:null,
    name:null,
    tel:null,
    age:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.data.buttons[0].checked = true;
    this.setData({
      buttons: this.data.buttons,
      id:options.id,
      institution_id:options.institution_id,
      ipUrl:app.globalData.ipUrl,
      age:'0-3岁'
    })
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/audition', {
      token:wx.getStorageSync('openid'),
      id:that.data.id
    }, "GET")
    .then(res => {
      console.log(res,'3232333')
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
                  url: '../../index'
                })
              })
            }, 1000) //延迟时间
          }
        })
      }
      that.setData({
        detail:res.data
      })
      wx.hideLoading()
      
    })


    // 加载年龄
    app.http('api/age', {}, "GET")
    .then(res => {
      console.log(res,'age')

      var data = res.data
      that.setData({
        buttons: data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  radioButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        //当前点击的位置为true即选中
        this.data.buttons[i].checked = true;
      }
      else {
        //其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    this.setData({
      buttons: this.data.buttons,
      msg: "id:"+id,
      age:name
    })
  },
  checkButtonTap:function(e){
    let id = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        if (this.data.buttons[i].checked == true) {
          this.data.buttons[i].checked = false;
         
        } else {
          this.data.buttons[i].checked = true;
          
        }
      }
    }
   this.setData({
     buttons: this.data.buttons,
     msg: "id:"+id
    })
    
  },
  forName:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  forTel:function(e){
    this.setData({
      tel:e.detail.value
    })
  },
  submitForm:function(){
    var that = this

    if(that.data.name == null || that.data.name == ''){
      wx.showToast({
        title: '请填写姓名',
        duration: 2000,
        icon:'none'
      })
      return
    }
    if(that.data.tel == null || that.data.tel == ''){
      wx.showToast({
        title: '请填写电话',
        duration: 2000,
        icon:'none'
      })
      return
    }
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/audition', {
      token:wx.getStorageSync('openid'),
      course_id:that.data.id,
      institution_id:that.data.institution_id,
      name:that.data.name,
      tel:that.data.tel,
      age:that.data.age
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
                  url: '../../index'
                })
              })
            }, 1000) //延迟时间
          }
        })
      }



      wx.redirectTo({
        url:'../success/success'
      })
      wx.hideLoading()
    })
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