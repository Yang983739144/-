module.exports = function(e) {
    if ((g = getCurrentPages()).length) {
        var r = g[g.length - 1];
        r && "pages/login/login" != r.route && wx.setStorageSync("login_pre_page", r);
    }
    return void wx.redirectTo({
        url: "/pages/login/login"
    });
    var g;
};