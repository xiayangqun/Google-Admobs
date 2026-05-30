package com.google.android.ads.nativetemplates;

import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;

/**
 * A class containing the style options for a NativeTemplateStyle.
 */
public class NativeTemplateStyle {

    private ColorDrawable mainBackgroundColor;
    private ColorDrawable callToActionBackgroundColor;
    private Typeface callToActionTextTypeface;
    private float callToActionTextSize;
    private ColorDrawable secondaryBackgroundColor;
    private Typeface secondaryTextTypeface;
    private float secondaryTextSize;
    private int secondaryTextColor;
    private Typeface tertiaryTextTypeface;
    private float tertiaryTextSize;
    private int tertiaryTextColor;
    private Typeface primaryTextTypeface;
    private float primaryTextSize;
    private int primaryTextColor;
    private ColorDrawable primaryTextBackgroundColor;
    private ColorDrawable tertiaryTextBackgroundColor;
    private ColorDrawable secondaryTextBackgroundColor;

    public ColorDrawable getMainBackgroundColor() {
        return mainBackgroundColor;
    }

    public ColorDrawable getCallToActionBackgroundColor() {
        return callToActionBackgroundColor;
    }

    public Typeface getCallToActionTextTypeface() {
        return callToActionTextTypeface;
    }

    public float getCallToActionTextSize() {
        return callToActionTextSize;
    }

    public ColorDrawable getSecondaryBackgroundColor() {
        return secondaryBackgroundColor;
    }

    public Typeface getSecondaryTextTypeface() {
        return secondaryTextTypeface;
    }

    public float getSecondaryTextSize() {
        return secondaryTextSize;
    }

    public int getSecondaryTextColor() {
        return secondaryTextColor;
    }

    public Typeface getTertiaryTextTypeface() {
        return tertiaryTextTypeface;
    }

    public float getTertiaryTextSize() {
        return tertiaryTextSize;
    }

    public int getTertiaryTextColor() {
        return tertiaryTextColor;
    }

    public Typeface getPrimaryTextTypeface() {
        return primaryTextTypeface;
    }

    public float getPrimaryTextSize() {
        return primaryTextSize;
    }

    public int getPrimaryTextColor() {
        return primaryTextColor;
    }

    public ColorDrawable getPrimaryTextBackgroundColor() {
        return primaryTextBackgroundColor;
    }

    public ColorDrawable getTertiaryTextBackgroundColor() {
        return tertiaryTextBackgroundColor;
    }

    public ColorDrawable getSecondaryTextBackgroundColor() {
        return secondaryTextBackgroundColor;
    }

    public static class Builder {
        private NativeTemplateStyle styles;

        public Builder() {
            styles = new NativeTemplateStyle();
        }

        public Builder withMainBackgroundColor(ColorDrawable mainBackgroundColor) {
            styles.mainBackgroundColor = mainBackgroundColor;
            return this;
        }

        public Builder withCallToActionBackgroundColor(ColorDrawable callToActionBackgroundColor) {
            styles.callToActionBackgroundColor = callToActionBackgroundColor;
            return this;
        }

        public Builder withCallToActionTextTypeface(Typeface callToActionTextTypeface) {
            styles.callToActionTextTypeface = callToActionTextTypeface;
            return this;
        }

        public Builder withCallToActionTextSize(float callToActionTextSize) {
            styles.callToActionTextSize = callToActionTextSize;
            return this;
        }

        public Builder withSecondaryBackgroundColor(ColorDrawable secondaryBackgroundColor) {
            styles.secondaryBackgroundColor = secondaryBackgroundColor;
            return this;
        }

        public Builder withSecondaryTextTypeface(Typeface secondaryTextTypeface) {
            styles.secondaryTextTypeface = secondaryTextTypeface;
            return this;
        }

        public Builder withSecondaryTextSize(float secondaryTextSize) {
            styles.secondaryTextSize = secondaryTextSize;
            return this;
        }

        public Builder withSecondaryTextColor(int secondaryTextColor) {
            styles.secondaryTextColor = secondaryTextColor;
            return this;
        }

        public Builder withTertiaryTextTypeface(Typeface tertiaryTextTypeface) {
            styles.tertiaryTextTypeface = tertiaryTextTypeface;
            return this;
        }

        public Builder withTertiaryTextSize(float tertiaryTextSize) {
            styles.tertiaryTextSize = tertiaryTextSize;
            return this;
        }

        public Builder withTertiaryTextColor(int tertiaryTextColor) {
            styles.tertiaryTextColor = tertiaryTextColor;
            return this;
        }

        public Builder withPrimaryTextTypeface(Typeface primaryTextTypeface) {
            styles.primaryTextTypeface = primaryTextTypeface;
            return this;
        }

        public Builder withPrimaryTextSize(float primaryTextSize) {
            styles.primaryTextSize = primaryTextSize;
            return this;
        }

        public Builder withPrimaryTextColor(int primaryTextColor) {
            styles.primaryTextColor = primaryTextColor;
            return this;
        }

        public Builder withPrimaryTextBackgroundColor(ColorDrawable primaryTextBackgroundColor) {
            styles.primaryTextBackgroundColor = primaryTextBackgroundColor;
            return this;
        }

        public Builder withTertiaryTextBackgroundColor(ColorDrawable tertiaryTextBackgroundColor) {
            styles.tertiaryTextBackgroundColor = tertiaryTextBackgroundColor;
            return this;
        }

        public Builder withSecondaryTextBackgroundColor(ColorDrawable secondaryTextBackgroundColor) {
            styles.secondaryTextBackgroundColor = secondaryTextBackgroundColor;
            return this;
        }

        public NativeTemplateStyle build() {
            return styles;
        }
    }
}
