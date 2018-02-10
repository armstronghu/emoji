import emojis from 'data';
var all = getApp().globalData.all
Page({
  data: {
    tabs: ["人物", "食物", "自然", "旅行", "物体", "活动", "符号","旗帜"],
    activeIndex: 0,
    emojis: emojis,   //只作为view渲染命令接口用，即单向到view
    emojiValues: "",
    tipsShow: true,
    copyAreaCursor: 0,
    autoHeight: false,
    height: 57,

    indicatorDots:false,
    autoplay: false,
    swiperH:0,
    currSwiper:0
  },
  order: ['people','food','nature','travel','objects','activity','symbols','flags'],
  heights: [],
  lastRow: 0,
  state: 0,   //0:没有聚焦过  1:获得焦点 2:焦点失去事件处理完成
  viewData:{
    emojiValues: '',
    copyAreaCursor: 0
  },
  onLoad: function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var sysW = res.screenWidth
        that.heights[0] = Math.ceil(emojis.people.length * 40 / (sysW - 54)) + 1
        that.heights[1] = Math.ceil(emojis.food.length * 40 / (sysW - 54)) +1
        that.heights[2] = Math.ceil(emojis.nature.length * 40 / (sysW - 54)) +1
        that.heights[3] = Math.ceil(emojis.travel.length * 40 / (sysW - 54)) +1
        that.heights[4] = Math.ceil(emojis.objects.length * 40 / (sysW - 54)) +1
        that.heights[5] = Math.ceil(emojis.activity.length * 40 / (sysW - 54)) +1
        that.heights[6] = Math.ceil(emojis.symbols.length * 40 / (sysW - 54)) +1
        that.heights[7] = Math.ceil(emojis.flags.length * 40 / (sysW - 54)) +1
        that.setData({ swiperH: that.heights[0] * 40 })
      }
    });
  },
  swiperChange:function(e){
    var cidx = e.detail.current
    this.setData({ activeIndex: cidx, swiperH: this.heights[cidx] * 40})
  },
  onlinechange: function(e){
    var flag = '+'
    if (e.detail.lineCount > this.lastRow) flag = '+'
    if (e.detail.lineCount < this.lastRow) flag = '-'
    if (flag == '+' && e.detail.lineCount == 2 && this.data.autoHeight == false) {
      this.setData({ autoHeight: true})
    }
    if (flag == '-' && e.detail.lineCount == 2 && this.data.autoHeight == true) {
      this.setData({ autoHeight: false, height: 57})
    }
    this.lastRow = e.detail.lineCount
  },
  copyAreablur: function(e){
    this.viewData.copyAreaCursor = e.detail.cursor
    console.log(e.detail.cursor)
    this.state = 2
  },
  copyAreafocus: function (e) {
    this.state = 1
  },
  tabEmoji: function (e) {
    var that = this
    var event = e
    var interval = setInterval(function(){
      if(that.state == 0 || that.state == 2){
        const add = convert(event.currentTarget.dataset.point)
        const header = that.viewData.emojiValues.slice(0, that.viewData.copyAreaCursor)
        const tail = that.viewData.emojiValues.slice(that.viewData.copyAreaCursor, that.viewData.emojiValues.length)
        that.viewData.emojiValues = header + add + tail
        that.viewData.copyAreaCursor = that.viewData.copyAreaCursor + add.length
        that.setData({ copyAreaCursor: that.viewData.copyAreaCursor })
        that._emojiChanged(that.viewData.emojiValues)
        that.state = 0
        clearInterval(interval)
      }
    },50)
  },
  copyAreaTypeing: function (e) {
    this.viewData.emojiValues = e.detail.value
    this._copy(this.viewData.emojiValues)
  },

  _emojiChanged: function (newEmojis) {
    this.setData({
      emojiValues: newEmojis,
    })
    this._copy(newEmojis)
  },
  _copy: function (value) {
    wx.setClipboardData({
      data: value,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },

  //clear button event handle
  clearTips: function(){
    this.setData({
      tipsShow: false
    });
  },
  clearCopyArea: function () {
    this._reset()
  },
  _reset: function () {
    this.viewData.emojiValues = ''
    this.setData({
      emojiValues: '',
      autoHeight: false,
      height: 57
    })
  },
 //tab click event handle
  tabClick: function (e) {
    var nidx = e.currentTarget.id
    this.setData({
      activeIndex: nidx,
      currSwiper: nidx
    });
  },
  onPullDownRefresh: function(){
    console.log('up')
    wx.stopPullDownRefresh()
  }
});

function convert(unicode) {
  var s, lo, hi;
  if (unicode.indexOf("-") > -1) {
    var parts = [];
    s = unicode.split('-');
    for (var i = 0; i < s.length; i++) {
      var part = parseInt(s[i], 16);
      if (part >= 0x10000 && part <= 0x10FFFF) {
        hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
        lo = ((part - 0x10000) % 0x400) + 0xDC00;
        part = (String.fromCharCode(hi) + String.fromCharCode(lo));
      }
      else {
        part = String.fromCharCode(part);
      }
      parts.push(part);
    }
    //return parts.join("\u200D");
    return parts.join('');
  }
  else {
    s = parseInt(unicode, 16);
    if (s >= 0x10000 && s <= 0x10FFFF) {
      hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
      lo = ((s - 0x10000) % 0x400) + 0xDC00;
      return (String.fromCharCode(hi) + String.fromCharCode(lo));
    }
    else {
      return String.fromCharCode(s);
    }
  }
}