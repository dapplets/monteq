package com.monteq;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner;
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;


public class BarcodeScannerModule extends ReactContextBaseJavaModule {
    BarcodeScannerModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "BarcodeScannerModule";
    }

    @ReactMethod
    public void scan(Promise promise) {
        GmsBarcodeScannerOptions options = new GmsBarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .build();

        ReactApplicationContext context = this.getReactApplicationContext();
        GmsBarcodeScanner scanner = GmsBarcodeScanning.getClient(context, options);

        scanner
            .startScan()
            .addOnSuccessListener(barcode -> promise.resolve(barcode.getRawValue()))
            .addOnCanceledListener(() -> promise.reject("CANCELED", "User canceled scanning"))
            .addOnFailureListener(e -> promise.reject("FAILURE", e));
    }
}