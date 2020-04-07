// pages/my/settled/settled.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      id: 1,
      name: '0-3岁'
    }, {
      id: 2,
      name: '3-6岁'
    }, {
      id: 3,
      name: '6-12岁'
    }, {
      id: 4,
      name: '12-15岁'
    }, {
      id: 5,
      name: '15-18岁'
    }],
    age: null,
    textStyle: "display:none",
    adress: null,
    name: null,
    tel: null,
    form:[],
    adressAll:null,
    adress:null,
    text:null,
    checked:0,
   
    is_join:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.data.buttons[0].checked = true;
    this.setData({
      age: '0-3岁'
    })


    that.loadFrom()
    that.loadlas()

  },
  loadlas: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/category', {}, "GET")
      .then(res => {
        console.log(res, '1232132131')
        var qita = {
          id: '',
          name: '其他'
        }
        var num = res.data
        num.push(qita)
        that.setData({
          buttons: num
        })
        wx.hideLoading()
      })
  },
  loadFrom: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/join', {
      token:wx.getStorageSync('openid')
    }, "GET")
      .then(res => {
        console.log(res, 'from')
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
        var data = res.data.field
        data.map(function(e){
           e.value = '' 
        })
        that.setData({
          form:data,
          is_join:res.data.is_join
        })
        console.log(that.data.form)
        wx.hideLoading()
      })
  },
  radioButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        //当前点击的位置为true即选中
        this.data.buttons[i].checked = true;
      } else {
        //其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    if (id == '') {
      this.setData({
        textStyle: 'display:block'
      })
    } else {
      this.setData({
        textStyle: 'display:none'
      })
    }
    this.setData({
      buttons: this.data.buttons,
      msg: "id:" + id,
      age: name
    })
  },
  checkButtonTap: function (e) {
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
      msg: "id:" + id
    })

  },
  forText:function(e){
    this.setData({
      text: e.detail.value
    })
  },
  forName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  forAdress:function(e){
    this.setData({
      adress:e.detail.value
    })
  },
  forAderssAll:function(e){
    this.setData({
      adressAll:e.detail.value
    })
  },
  forTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  forAdress: function (e) {
    this.setData({
      adress: e.detail.value
    })
  },
  submitForm:function(e){
    
      var that  =this
      var is_join = e.currentTarget.dataset.is_join
      if(is_join == 0){
        if(that.data.name == null || that.data.name == ''){
          wx.showToast({
            title: '请填写机构名称',
            duration: 2000,
            icon:'none'
          })
          return
        }
        if(that.data.adress == null || that.data.adress == ''){
          wx.showToast({
            title: '请填写机构地址',
            duration: 2000,
            icon:'none'
          })
          return
        }
        if(that.data.adressAll == null || that.data.adressAll == ''){
          wx.showToast({
            title: '请填写详细地址',
            duration: 2000,
            icon:'none'
          })
          return
        }
        if(that.data.tel == null || that.data.tel == ''){
          wx.showToast({
            title: '请填写机构电话',
            duration: 2000,
            icon:'none'
          })
          return
        }
        if(that.data.checked === 0){
          wx.showToast({
            title: '请同意协议',
            duration: 2000,
            icon:'none'
          })
          return
        }
  
  
        app.http('api/user/join?token=' + wx.getStorageSync('openid'), {
          'name_0':that.data.name,
          'name_1':that.data.adress,
          'name_2':that.data.adressAll,
          'name_3':that.data.tel,
          'name_4':that.data.age==''?that.data.text:that.data.age
        }, "POST")
        .then(res => {
          console.log(res,'dsadasdasdsa')

          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000,
            success:function(){
              console.log('haha');
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateBack({
                  delta: 1
                })
              }, 2000) //延迟时间
            }
          })


          
          wx.hideLoading()
        })
      }else{
        wx.showToast({
          title: '我们会尽快与您联系！',
          duration: 2000,
          icon:'none'
        })
      }
      
  },

  checkboxChange: function (e) {
    var that = this
    if(e.detail.value[0] == null || e.detail.value[0] == ''){
      that.setData({
        checked:0
      })
    }else{
      that.setData({
        checked:1
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 查询表单信息
  loaduser:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/form', {
      token:wx.getStorageSync('openid')
    }, "GET")
      .then(res => {
        // var data = res.data.field
        // data.map(function(e){
        //    e.value = '' 
        // })
        // that.setData({
        //   form:data
        // })
        var data =JSON.parse(res.data.content)
        console.log(data)
        that.setData({
          name:data.name_0,
          adress:data.name_1,
          adressAll:data.name_2,
          tel:data.name_3,
          age:data.name_4
        })
        console.log(that.data.form)
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loaduser()
    console.log(this.data.name)
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