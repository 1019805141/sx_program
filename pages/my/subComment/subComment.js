// pages/my/subComment/subComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_1: '', //点亮的星星数
    two_1: '', //没有点亮的星星数
    one_2: 0, //点亮的星星数
    two_2: 5, //没有点亮的星星数
    type: null,
    id: null,
    list: null,
    order_no: null,
    ipUrl: null,
    huanjing: '',
    shizi: '',
    jiaotong: '',
    fuwu: '',
    xiaoguo: '',
    liyou: '',
    imgList: [
      
    ],
    imgList2:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      one_1: this.data.num,
      two_1: 5 - this.data.num,
      type: options.type,
      id: options.id,
      order_no: options.order_no,
      ipUrl: app.globalData.ipUrl
    })
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/appraise/update', {
        token: wx.getStorageSync('openid'),
        order_id: that.data.id,
        type: that.data.type
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
        console.log(res, 'dadsadsadasdasd')
        that.setData({
          list: res.data[0]
        })
        wx.hideLoading()
      })
  },
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    console.log(e.currentTarget.dataset.in);
    console.log(e.currentTarget);
    var one_2;
    if (in_xin == 'star') {
      one_2 = Number(e.currentTarget.id)
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  },
  bindChooiceProduct: function () {
    var that = this;

    wx.chooseImage({
      count: 3, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        console.log(tempFilePaths)
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: 'https://tongxueyueke.com/' + 'api/user/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              file: i,
              token: wx.getStorageSync('openid')
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              console.log(data)

              var imgdata = 'https://tongxueyueke.com' + data.data.path
              var imgList = that.data.imgList
              var imgList2 = that.data.imgList2
              imgList2.push(data.data.path)
              imgList.push(imgdata)
              that.setData({
                imgList:imgList,
                imgList2:imgList2
              })
              console.log(that.data.imgList)
              
              //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
              // var productInfo = that.data.productInfo;  
              // if (productInfo.bannerInfo == null) {  
              //   productInfo.bannerInfo = [];  
              // }  
              // productInfo.bannerInfo.push({  
              //   "catalog": data.Catalog,  
              //   "fileName": data.FileName,  
              //   "url": data.Url  
              // });  
              // that.setData({  
              //   productInfo: productInfo  
              // });  

              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) {}
              })
            }
          });
        }
      }
    });
  },
  submit: function () {
    var that = this
    var og = that.data.list
    var imgList = that.data.imgList2
    var content = [{
        key: '【环境】',
        value: that.data.huanjing
      },
      {
        key: '【交通】',
        value: that.data.jiaotong
      },
      {
        key: '【师资】',
        value: that.data.shizi
      },
      {
        key: '【服务】',
        value: that.data.fuwu
      },
      {
        key: '【效果】',
        value: that.data.xiaoguo
      },
      {
        key: '【选择理由】',
        value: that.data.liyou
      }
    ]


    var ar = JSON.stringify(content)
    var img = JSON.stringify(imgList)
    console.log(ar)
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/appraise/update', {
        token: wx.getStorageSync('openid'),
        grade: that.data.one_2,
        type: that.data.type,
        institution_id: og.institution_id,
        order_id: that.data.id,
        course_id: og.id,
        content: ar,
        images:img
      }, "POST")
      .then(res => {
        console.log(res, 'dadsadsadasdasd')
        if (res.status_code == 200) {
          wx.showToast({
            title: '发布成功！',
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateBack({
                  detail: 1
                })
              }, 1000) //延迟时间
            }
          })

        }
        wx.hideLoading()
      })
  },

  jiaotong: function (e) {
    this.setData({
      jiaotong: e.detail.value
    })
  },
  huanjing: function (e) {
    this.setData({
      huanjing: e.detail.value
    })
  },
  shizi: function (e) {
    this.setData({
      shizi: e.detail.value
    })
  },
  fuwu: function (e) {
    this.setData({
      fuwu: e.detail.value
    })
  },
  xiaoguo: function (e) {
    this.setData({
      xiaoguo: e.detail.value
    })
  },
  liyou: function (e) {
    this.setData({
      liyou: e.detail.value
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