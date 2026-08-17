package it.psyetica.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.IOException;
import java.io.InputStream;

public final class MainActivity extends Activity {
    private static final String APP_HOST = "app.local";
    private static final String START_URL = "https://" + APP_HOST + "/index.html";
    private WebView webView;
    private OnBackInvokedCallback backCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureSystemBars(false);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(244, 248, 247));
        setContentView(webView);
        configureWebView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            backCallback = this::handleBack;
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                backCallback
            );
        }
        webView.loadUrl(START_URL);
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);

        webView.addJavascriptInterface(new AppBridge(), "PsyEticaNative");
        webView.setWebViewClient(new LocalAssetClient());
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
    }

    private void configureSystemBars(boolean dark) {
        Window window = getWindow();
        int color = Color.parseColor(dark ? "#081A1D" : "#F4F8F7");
        window.setStatusBarColor(color);
        window.setNavigationBarColor(color);
        int flags = window.getDecorView().getSystemUiVisibility();
        if (dark) {
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        } else {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        window.getDecorView().setSystemUiVisibility(flags);
    }

    @Override
    @SuppressLint("GestureBackNavigation")
    public void onBackPressed() {
        handleBack();
    }

    private void handleBack() {
        webView.evaluateJavascript(
            "window.PsyEticaApp ? String(window.PsyEticaApp.back()) : 'false'",
            result -> {
                if (!"\"true\"".equals(result) && !"true".equals(result)) {
                    finishAfterTransition();
                }
            }
        );
    }

    @Override
    protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && backCallback != null) {
            getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backCallback);
        }
        if (webView != null) {
            webView.removeJavascriptInterface("PsyEticaNative");
            webView.destroy();
        }
        super.onDestroy();
    }

    public final class AppBridge {
        @JavascriptInterface
        public void setDarkMode(boolean dark) {
            runOnUiThread(() -> configureSystemBars(dark));
        }

        @JavascriptInterface
        public void share(String subject, String text) {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/plain");
            intent.putExtra(Intent.EXTRA_SUBJECT, subject);
            intent.putExtra(Intent.EXTRA_TEXT, text);
            runOnUiThread(() -> startActivity(Intent.createChooser(intent, subject)));
        }

        @JavascriptInterface
        public void openUrl(String rawUrl) {
            Uri uri = Uri.parse(rawUrl);
            String scheme = uri.getScheme();
            if (!("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme))) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Link non valido", Toast.LENGTH_SHORT).show());
                return;
            }
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            runOnUiThread(() -> {
                try {
                    startActivity(intent);
                } catch (Exception error) {
                    Toast.makeText(MainActivity.this, "Nessuna app disponibile per aprire il link", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private final class LocalAssetClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!"https".equalsIgnoreCase(uri.getScheme()) || !APP_HOST.equalsIgnoreCase(uri.getHost())) {
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }

            String path = uri.getPath();
            if (path == null || "/".equals(path)) path = "/index.html";
            path = path.substring(1);
            if (path.contains("..")) return new WebResourceResponse("text/plain", "UTF-8", null);

            try {
                InputStream stream = getAssets().open("www/" + path);
                return new WebResourceResponse(mimeTypeFor(path), "UTF-8", stream);
            } catch (IOException notFound) {
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (APP_HOST.equalsIgnoreCase(uri.getHost())) return false;
            String scheme = uri.getScheme();
            if ("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme)) {
                new AppBridge().openUrl(uri.toString());
            }
            return true;
        }

        private String mimeTypeFor(String path) {
            String extension = MimeTypeMap.getFileExtensionFromUrl(path);
            String inferred = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            if (inferred != null) return inferred;
            if (path.endsWith(".json")) return "application/json";
            if (path.endsWith(".js")) return "application/javascript";
            if (path.endsWith(".css")) return "text/css";
            if (path.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }
    }
}
