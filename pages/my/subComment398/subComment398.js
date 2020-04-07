// pages/my/subComment/subComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    id: null,
    ipUrl: null,
    num: 0,
    list: [{
      one_1: '', //点亮的星星数
      two_1: '', //没有点亮的星星数
      one_2: 0, //点亮的星星数
      two_2: 5, //没有点亮的星星数
      imgList2: [],
      huanjing: '',
      shizi: '',
      jiaotong: '',
      fuwu: '',
      xiaoguo: '',
      liyou: '',
      content: [{
          key: '【环境】',
          value: ''
        },
        {
          key: '【交通】',
          value: ''
        },
        {
          key: '【师资】',
          value: ''
        },
        {
          key: '【服务】',
          value: ''
        },
        {
          key: '【效果】',
          value: ''
        },
        {
          key: '【选择理由】',
          value: ''
        }
      ],
      imgList: [

      ],
      imgList2: []
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      type: options.type,
      id: options.id,
      ipUrl: app.globalData.ipUrl
    })
    console.log(options)

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


        var content = [{
            key: '【环境】',
            value: ''
          },
          {
            key: '【交通】',
            value: ''
          },
          {
            key: '【师资】',
            value: ''
          },
          {
            key: '【服务】',
            value: ''
          },
          {
            key: '【效果】',
            value: ''
          },
          {
            key: '【选择理由】',
            value: ''
          }
        ]


        console.log(res, 'dadsadsadasdasd')
        res.data.map(function (m) {
          m.one_2 = that.data.num
          m.two_2 = 5 - that.data.num
          m.content = content
          m.imgList = []
          m.imgList2 = []
        })
        that.setData({
          list: res.data
        })
        wx.hideLoading()
      })

  },
  bindChooiceProduct: function (e) {
    var that = this;
    console.log(e, '321323213')
    var index = e.currentTarget.dataset.index
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

              var list = that.data.list
              var imgdata = 'https://tongxueyueke.com' + data.data.path
              list[index].imgList.push(imgdata)
              list[index].imgList2.push(data.data.path)
              that.setData({
                list:list,
              })

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
  in_xin: function (e) {
    console.log(e)
    //点击
    var index = e.target.dataset.index
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin == 'star') {
      one_2 = Number(e.currentTarget.id)
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.list[index].one_2
    }
    var list = this.data.list
    list[index].one_2 = one_2
    list[index].two_2 = 5 - one_2
    this.setData({
      list: list
    })
  },
  addImg: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //事件

  jiaotong: function (e) {
    console.log(e)
    var jiaotong = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].content[1].value = jiaotong
    this.setData({
      list: list
    })
    console.log(list)
  },
  huanjing: function (e) {
    var huanjing = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[0].content[0].value = huanjing
    // this.setData({
    //   list: list
    // })
    console.log(list)
  },
  shizi: function (e) {
    var shizi = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].content[2].value = shizi
    this.setData({
      list: list
    })
    console.log(list)
  },
  fuwu: function (e) {
    console.log(e)

    var shizi = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].content[3].value = shizi
    this.setData({
      list: list
    })
    console.log(list)
  },
  xiaoguo: function (e) {
    console.log(e)

    var shizi = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].content[4].value = shizi
    this.setData({
      list: list
    })
    console.log(list)
  },
  liyou: function (e) {
    console.log(e)

    var shizi = e.detail.value
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].content[5].value = shizi
    this.setData({
      list: list
    })
    console.log(list)
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

  },
  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var list = []
    var lis = this.data.list
    lis.map(function (z, index) {
      var obj = {}
      var content = [{
          key: '【环境】',
          value: ''
        },
        {
          key: '【交通】',
          value: ''
        },
        {
          key: '【师资】',
          value: ''
        },
        {
          key: '【服务】',
          value: ''
        },
        {
          key: '【效果】',
          value: ''
        },
        {
          key: '【选择理由】',
          value: ''
        }
      ]
      obj.content = content
      obj.id = z.id
      obj.course_id = z.id
      obj.institution = z.institution
      obj.institution_id = z.institution_id
      obj.name = z.name
      obj.grade = z.one_2
      obj.order_id = that.data.id
      obj.images =  JSON.stringify(z.imgList2) 
      list.push(obj)
      add(index)
      list[index].content = JSON.stringify(list[index].content)
    })

    function add(inz) {
      var huanjing = 'huanjing' + inz
      list[inz].content[0].value = e.detail.value[huanjing]
      var jiaotong = 'jiaotong' + inz
      list[inz].content[1].value = e.detail.value[jiaotong]
      var shizi = 'shizi' + inz
      list[inz].content[2].value = e.detail.value[shizi]
      var fuwu = 'fuwu' + inz
      list[inz].content[3].value = e.detail.value[fuwu]
      var xiaoguo = 'xiaoguo' + inz
      list[inz].content[4].value = e.detail.value[xiaoguo]
      var liyou = 'liyou' + inz
      list[inz].content[5].value = e.detail.value[liyou]
    }
    console.log(list)
    var datas = JSON.stringify(list)
    app.http('api/user/appraise/update', {
        token: wx.getStorageSync('openid'),
        datas: datas,
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
})