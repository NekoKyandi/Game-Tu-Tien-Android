package com.nguyenngocly.daoton;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Đăng ký JavascriptInterface vào WebView của Capacitor
        WebView webView = this.getBridge().getWebView();
        webView.getSettings().setJavaScriptEnabled(true);

        // "AndroidHost" là tên mà đạo hữu sẽ gọi từ file .js (ví dụ: AndroidHost.startUpdate(...))
        webView.addJavascriptInterface(new AppUpdateInterface(this), "AndroidHost");
    }
}
