import emojis from 'data';

Page({
  data: {
    tabs: ["人物", "食物", "自然", "旅行", "物体", "活动", "符号","旗帜"],
    activeIndex: 0,
    emojis: emojis,   //只作为view渲染命令接口用，即单向到view
    emojiValues: "",
    tipsShow: true
  },

  viewData:{
    emojiValues: ''
  },

  //emojis change event handle
  tabEmoji: function (e) {
    var p = e.currentTarget.dataset.point
    this.viewData.emojiValues = this.viewData.emojiValues + convert(p)
    this._emojiChanged(this.viewData.emojiValues)
  },
  copyAreaTypeing: function (e) {
    this.viewData.emojiValues = e.detail.value
    this._copy(this.viewData.emojiValues)
  },

  _emojiChanged: function (newEmojis) {
    this.setData({
      emojiValues: newEmojis
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
    console.log('clear all')
    this._reset()
  },
  _reset: function () {
    this.viewData.emojiValues = ''
    this.setData({
      emojiValues: ''
    })
  },
 //tab click event handle
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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