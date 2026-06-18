package com.iamvkryt.yomusic;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import androidx.core.view.WindowInsetsControllerCompat;



import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebChromeClient;
import android.webkit.WebChromeClient;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.widget.FrameLayout;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;


public class MainActivity extends BridgeActivity {

    private int statusBarHeightPx = 0;
    private int navigationBarHeightPx = 0;

    @Override
    public void onStart(){
        super.onStart();
        WebView web = getBridge().getWebView();
        if (web == null) return;
        web.setOverScrollMode(web.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);

        web.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");
        
        // 3. Extend BridgeWebViewClient so plugin bridges stay active!
        web.setWebViewClient(new BridgeWebViewClient(getBridge()) {
            @Override
            public void onPageFinished(WebView view, String url) {
                // Let Capacitor finish its internal loading hooks first
                super.onPageFinished(view, url);
                
                // Immediately calculate and inject calculated insets
                updateWebViewHeights();
            }
        });

        /** TRY YT FULL SCREEN */
        web.setWebChromeClient(new CustomWebClient(getBridge()));
    }

     // Helper method to extract raw pixels universally across API levels
    private int getRawSystemBarHeight(int type) {
        if (getWindow() != null && getWindow().getDecorView().getRootWindowInsets() != null) {
            WindowInsetsCompat insets = WindowInsetsCompat.toWindowInsetsCompat(
                    getWindow().getDecorView().getRootWindowInsets(), getWindow().getDecorView());
            Insets systemBarInsets = insets.getInsetsIgnoringVisibility(type);
            
            if (type == WindowInsetsCompat.Type.statusBars()) {
                return systemBarInsets.top;
            } else if (type == WindowInsetsCompat.Type.navigationBars()) {
                return systemBarInsets.bottom;
            }
        }
        
        // Robust internal fallback for older devices or early lifecycle calls
        String resourceName = (type == WindowInsetsCompat.Type.statusBars()) ? "status_bar_height" : "navigation_bar_height";
        int resourceId = getResources().getIdentifier(resourceName, "dimen", "android");
        if (resourceId > 0) {
            return getResources().getDimensionPixelSize(resourceId);
        }
        return 0;
    }

    private void updateWebViewHeights() {
        WebView web = getBridge().getWebView();
        if (web == null) return;

        web.post(() -> {
            if (android.os.Build.VERSION.SDK_INT <= android.os.Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // Code for Android 14 and less versions only as capacitor handles for android 15 and 16:
                int statusBarHeightPx = getRawSystemBarHeight(WindowInsetsCompat.Type.statusBars());
                int navigationBarHeightPx = getRawSystemBarHeight(WindowInsetsCompat.Type.navigationBars());
                
                // Get the device density scaling factor (e.g., 2.0, 3.0, 4.0)
                float density = getResources().getDisplayMetrics().density;
                
                // Convert physical pixels to DP/Web pixels
                int statusBarDp = Math.round(statusBarHeightPx / density);
                int navigationBarDp = Math.round(navigationBarHeightPx / density);

                String js = String.format(
                    "document.body.style.paddingTop = '%dpx';" + 
                    "document.body.style.paddingBottom  = '%dpx';"
                    ,statusBarDp, navigationBarDp
                );
                web.evaluateJavascript(js, null);
            }
        });
    }

    // JavaScript Bridge
    public class WebAppInterface {
        @JavascriptInterface
        public int getStatusBarHeight() {
            int statusBarHeightPx = getRawSystemBarHeight(WindowInsetsCompat.Type.statusBars());
            float density = getResources().getDisplayMetrics().density;
            int statusBarDp = Math.round(statusBarHeightPx / density);
            return statusBarDp;
        }

        @JavascriptInterface
        public int getNavigationBarHeight() {
            int navigationBarHeightPx = getRawSystemBarHeight(WindowInsetsCompat.Type.navigationBars());
            float density = getResources().getDisplayMetrics().density;
            int navigationBarDp = Math.round(navigationBarHeightPx / density);
            return navigationBarDp;
        }
    }

    public class CustomWebClient extends BridgeWebChromeClient {//WebChromeClient

        // Constructor for CustomWebClient
        public CustomWebClient(Bridge bridge) {
            super(bridge);
        }
        /** NEW */
        private View mCustomView;
        private WebChromeClient.CustomViewCallback mCustomViewCallback;
        private int mOriginalOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        private int mOriginalSystemUiVisibility;

        
        
        // This method can return the default video poster.
        @Override
        public Bitmap getDefaultVideoPoster() {
            return BitmapFactory.decodeResource(MainActivity.this.getResources(), R.drawable.splash);
        }

        @Override
        public void onShowCustomView(View paramView, WebChromeClient.CustomViewCallback viewCallback) {
            // super.onShowCustomView(paramView,viewCallback);
            if (mCustomView != null) {
                onHideCustomView();
                return;
            }

            mCustomView = paramView;
            mCustomViewCallback = viewCallback;

            // Save original orientation
            mOriginalOrientation = MainActivity.this.getRequestedOrientation();

            // Force landscape for fullscreen
            MainActivity.this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

            mOriginalSystemUiVisibility = MainActivity.this.getWindow().getDecorView().getSystemUiVisibility();

            ((FrameLayout) MainActivity.this.getWindow().getDecorView())
                .addView(mCustomView, new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT, 
                    FrameLayout.LayoutParams.MATCH_PARENT
                ));

            MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            );
        }
        
        @Override
        public void onHideCustomView() {
            // super.onHideCustomView();
            if (mCustomView == null) return;

            ((FrameLayout) MainActivity.this.getWindow().getDecorView())
                .removeView(mCustomView);
            mCustomView = null;

            MainActivity.this.getWindow().getDecorView()
                .setSystemUiVisibility(mOriginalSystemUiVisibility);

            // Restore original orientation
            // MainActivity.this.setRequestedOrientation(mOriginalOrientation);
            MainActivity.this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT); 

            mCustomViewCallback.onCustomViewHidden();
            mCustomViewCallback = null;
        }
    }
}


