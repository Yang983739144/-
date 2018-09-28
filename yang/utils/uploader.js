module.exports = {
    upload: function(t) {
        function e(e) {
            "function" == typeof t.start && t.start(e), wx.uploadFile({
                url: t.url || a.api.default.upload_image,
                filePath: e.path,
                name: t.name || "image",
                formData: t.data || {},
                success: function(e) {
                    200 == e.statusCode ? "function" == typeof t.success && (e.data = JSON.parse(e.data), 
                    t.success(e.data)) : "function" == typeof t.error && t.error("上传错误：" + e.statusCode + "；" + e.data), 
                    t.complete();
                },
                fail: function(e) {
                    "function" == typeof t.error && t.error(e.errMsg), t.complete();
                }
            });
        }
        var a = getApp();
        (t = t || {}).complete = t.complete || function() {}, t.data = t.data || {}, t.data._uniacid = t.data._uniacid || a.siteInfo.uniacid, 
        t.data._acid = t.data._acid || a.siteInfo.acid, wx.chooseImage({
            count: 1,
            success: function(a) {
                if (a.tempFiles && a.tempFiles.length > 0) {
                    var o = a.tempFiles[0];
                    e(o);
                } else "function" == typeof t.error && t.error("请选择文件"), t.complete();
            },
            fail: function(e) {
                "function" == typeof t.error && (t.error("请选择文件"), t.complete());
            }
        });
    }
};