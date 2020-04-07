// pages/org/org.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    coursesList: [],
    appraisesList: [],
    ipUrl: null,
    picturesList:[],
    teacherList:[],
    id:null,
    institutionList:[],
    token:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    that.setData({
      ipUrl: app.globalData.ipUrl,
      id:id
    })
    // 加载详情
    app.http('api/institution/detail', {
        id: id
      }, "GET")
      .then(res => {
        if (res.data.appraise.length > 0) {
          var xiaoshu = res.data.appraise[0].aggregate + ''
          if (xiaoshu.split('.' [1])) {
            res.data.appraise[0].xiaoshu = true
            res.data.appraise[0].xiaoshuz = xiaoshu.split('.')[0]
          } else {
            res.data.appraise[0].xiaoshu = false
          }
        }
        //  res.data.appraise.map(function (zz) {
        //   if (zz.length > 0) {
        //     var xiaoshu = zz.appraise[0].aggregate + ''
        //     if (xiaoshu.split('.')[1]) {
        //       zz.appraise[0].xiaoshu = true
        //       zz.appraise[0].xiaoshuz=xiaoshu.split('.')[0]
        //     } else {
        //       zz.appraise[0].xiaoshu = false
        //     }
        //   }
        // })
        that.setData({
          detail: res.data
        })
        wx.hideLoading()
      })
    // 获取机构课程
    app.http('api/institution/courses', {
        institution_id: id,
        index: 0,
        size: 4
      }, "GET")
      .then(res => {
        console.log(res,'机构课程')
        that.setData({
          coursesList: res.data.list
        })
      })
    that.loadAppraises(id)
    that.loadPictures(id)
    that.loadTeacher(id)
    that.loadInstitution()
  },
  // 拨打电话
  clickTel: function (e) {
    var that = this
    var tel = e.currentTarget.dataset.tel
    var id = e.currentTarget.dataset.id
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        // 更新拨打电话次数
        app.http('api/institution/call', {
            id: id  
          }, "POST")
          .then(res => {})
      },
    })
  },
  // 获取机构评价列表
  loadAppraises: function (id) {
    var that = this
    app.http('api/institution/appraises', {
        id: id,
        index: 0,
        size: 5
      }, "GET")
      .then(res => {

        var data = res.data[0].appraises
        data.map(function (zz) {
          if (zz.grade.split('.')[1]) {
            zz.xiaoshu = true
            zz.xiaoshuz = zz.grade.split('.')[0]
          } else {
            zz.xiaoshu = false
            zz.xiaoshuz = zz.grade
          }
          zz.grade = +zz.grade
        })
        that.setData({
          appraisesList: res.data[0].appraises
        })
      })
  },
  // 获取机构风采
  loadPictures: function (id) {
    var that = this
    app.http('api/institution/pictures', {
        institution_id: id,
        type: 1
      }, "GET")
      .then(res => {
        that.setData({
          picturesList:res.data
        })
      })
  },
  // 获取老师列表
  loadTeacher:function(id){
    var that = this
    app.http('api/institution/teachers', {
      institution_id: id,
      index: 0,
      size:4
    }, "GET")
    .then(res => {
      that.setData({
        teacherList:res.data.list
      })
    })
  },
  loadInstitution:function(){
    var that =this
    app.http('api/institution/nearby', {
      index: 0,
      size:5
    }, "GET")
    .then(res => {
      res.data.list.map(function (zz) {
        if (zz.appraise.length > 0) {
          var xiaoshu = zz.appraise[0].aggregate + ''
          if (xiaoshu.split('.')[1]) {
            zz.appraise[0].xiaoshu = true
            zz.appraise[0].xiaoshuz=xiaoshu.split('.')[0]
          } else {
            zz.appraise[0].xiaoshu = false
          }
        }
      })
      console.log(res, '机构列表')

      that.setData({
        institutionList:res.data.list
      })
    })
  },
  goCourses:function(){
    wx.navigateTo({
      url: 'curriculum/curriculum?id='+this.data.id
    })
  },
  goTeacher:function(){
    wx.navigateTo({
      url: 'teacherList/teacherList?id='+this.data.id
    })
  },
  goAppraises:function(){
    wx.navigateTo({
      url: 'comment/comment?id='+this.data.id
    })
  },
  goDemeanor:function(){
    wx.navigateTo({
      url: 'demeanor/demeanor?id='+this.data.id
    })
  },
  goCousers:function(e){
    var that =this
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../index/courseDetails/courseDetails?id='+id
    })
  },
    // 拨打电话
    goTel: function (e) {
      console.log(e)
      var that = this
      var tel = e.currentTarget.dataset.tel
      var id = e.currentTarget.dataset.id
      wx.makePhoneCall({
        phoneNumber: tel,
        success: function () {
          // 更新拨打电话次数
          app.http('api/institution/call', {
              id: id
            }, "POST")
            .then(res => {
            })
        },
      })
    },
    goBm:function(e){
      var institution_id = e.currentTarget.dataset.institution_id
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../index/courseDetails/audition/audition?id='+id+'&institution_id='+institution_id
      })
    },
    goqt:function(e){
      console.log(e,'dsadas')
      var id = e.currentTarget.dataset.id
      wx.redirectTo({
        url: 'org?id='+id
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