const app = getApp()

Page({
  data: {
    latitude: "",
    longitude: ""
  },
  onLoad: function() {
    this.getLocation()
  },
  /**
   * 3.3.1 获取用户定位
   */
  getLocation: function() {
    var self = this;
    self.setData({
      showConfirmGetLocation: false
    })
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的坐标，可传入'gcj02'
      altitude: true, //传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
      success: function(res) {
        console.log("定位信息:::", res)
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '本活动需要获取位置信息才能参与，请重新授权！',
          showCancel:false,
          confirmText: "重新授权",
          success: function(res) {
            self.openLocationSetting()
          }
        })
      }
    });
  },
  /**
   * 重新授权按钮点击事件
   * click event   
   */
  openLocationSetting: function() {
    var self = this
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
    wx.getSetting({
      success: function(res) {
        if (res.authSetting && !res.authSetting["scope.userLocation"]) {          
          //未授权则打开授权设置界面
          wx.openSetting({
            success: function(res) {
              //允许授权,则自动获取定位，并关闭二确弹窗，否则返回首页不处理
              self.getLocation();
            }
          })
        } else {
          //授权则重新获取位置新（授权设置界面返回首页，首页授权二确弹窗未关闭）
          self.getLocation();
        }
      }
    })
  }
})