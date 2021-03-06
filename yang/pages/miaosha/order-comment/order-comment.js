var t = require("../../../api.js"), o = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(a) {
        o.pageOnLoad(this);
        var i = this;
        i.setData({
            order_id: a.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: t.miaosha.comment_preview,
            data: {
                order_id: a.id
            },
            success: function(t) {
                if (wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var o in t.data.goods_list) t.data.goods_list[o].score = 3, t.data.goods_list[o].content = "", 
                    t.data.goods_list[o].pic_list = [], t.data.goods_list[o].uploaded_pic_list = [];
                    i.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var o = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.score, e = o.data.goods_list;
        e[a].score = i, o.setData({
            goods_list: e
        });
    },
    contentInput: function(t) {
        var o = this, a = t.currentTarget.dataset.index;
        o.data.goods_list[a].content = t.detail.value, o.setData({
            goods_list: o.data.goods_list
        });
    },
    chooseImage: function(t) {
        var o = this, a = t.currentTarget.dataset.index, i = o.data.goods_list, e = i[a].pic_list.length;
        wx.chooseImage({
            count: 6 - e,
            success: function(t) {
                i[a].pic_list = i[a].pic_list.concat(t.tempFilePaths), o.setData({
                    goods_list: i
                });
            }
        });
    },
    deleteImage: function(t) {
        var o = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex, e = o.data.goods_list;
        e[a].pic_list.splice(i, 1), o.setData({
            goods_list: e
        });
    },
    commentSubmit: function(a) {
        function i(o) {
            if (o == n.length) return e();
            var a = 0;
            if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return i(o + 1);
            for (var s in n[o].pic_list) !function(e) {
                wx.uploadFile({
                    url: t.default.upload_image,
                    name: "image",
                    filePath: n[o].pic_list[e],
                    complete: function(t) {
                        if (t.data) {
                            var s = JSON.parse(t.data);
                            0 == s.code && (n[o].uploaded_pic_list[e] = s.data.url);
                        }
                        if (++a == n[o].pic_list.length) return i(o + 1);
                    }
                });
            }(s);
        }
        function e() {
            o.request({
                url: t.miaosha.comment,
                method: "post",
                data: {
                    order_id: s.data.order_id,
                    goods_list: JSON.stringify(n)
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/miaosha/order/order?status=2"
                            });
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
        var s = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = s.data.goods_list;
        i(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});