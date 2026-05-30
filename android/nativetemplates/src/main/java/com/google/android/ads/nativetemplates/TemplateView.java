package com.google.android.ads.nativetemplates;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.google.android.gms.ads.nativead.MediaView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;

/**
 * A template layout for displaying a native ad.
 */
public class TemplateView extends FrameLayout {

    private int templateType;
    private NativeAdView nativeAdView;
    private NativeAd nativeAd;
    private NativeTemplateStyle styles;

    private ImageView primaryImageView;
    private ImageView iconImageView;
    private TextView primaryTextView;
    private TextView secondaryTextView;
    private RatingBar ratingBar;
    private TextView tertiaryTextView;
    private Button callToActionView;
    private MediaView mediaView;

    private static final int MEDIUM_TEMPLATE_TYPE = 1;
    private static final int SMALL_TEMPLATE_TYPE = 2;

    public TemplateView(Context context) {
        super(context);
    }

    public TemplateView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView(context, attrs);
    }

    public TemplateView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView(context, attrs);
    }

    private void initView(Context context, AttributeSet attrs) {
        TypedArray a = context.getTheme().obtainStyledAttributes(
                attrs,
                R.styleable.TemplateView,
                0, 0);

        try {
            templateType = a.getInteger(R.styleable.TemplateView_gnt_template_type, MEDIUM_TEMPLATE_TYPE);
        } finally {
            a.recycle();
        }
    }

    public void setNativeAd(NativeAd nativeAd) {
        this.nativeAd = nativeAd;
        NativeAdView adView = getNativeAdView();
        if (adView == null) {
            return;
        }

        String store = nativeAd.getStore();
        String advertiser = nativeAd.getAdvertiser();
        String headline = nativeAd.getHeadline();
        String body = nativeAd.getBody();
        String callToAction = nativeAd.getCallToAction();
        Double starRating = nativeAd.getStarRating();
        NativeAd.Image icon = nativeAd.getIcon();

        if (primaryTextView != null) {
            if (!TextUtils.isEmpty(headline)) {
                primaryTextView.setText(headline);
            }
        }

        if (secondaryTextView != null) {
            if (!TextUtils.isEmpty(store) && !TextUtils.isEmpty(advertiser)) {
                secondaryTextView.setText(advertiser);
            } else if (!TextUtils.isEmpty(advertiser)) {
                secondaryTextView.setText(advertiser);
            } else if (!TextUtils.isEmpty(store)) {
                secondaryTextView.setText(store);
            } else {
                secondaryTextView.setVisibility(GONE);
            }
        }

        if (tertiaryTextView != null) {
            if (!TextUtils.isEmpty(body)) {
                tertiaryTextView.setText(body);
            } else {
                tertiaryTextView.setVisibility(GONE);
            }
        }

        if (callToActionView != null) {
            if (!TextUtils.isEmpty(callToAction)) {
                callToActionView.setText(callToAction);
            } else {
                callToActionView.setVisibility(GONE);
            }
        }

        if (ratingBar != null) {
            if (starRating != null && starRating > 0) {
                ratingBar.setRating(starRating.floatValue());
                ratingBar.setVisibility(VISIBLE);
            } else {
                ratingBar.setVisibility(GONE);
            }
        }

        if (iconImageView != null) {
            if (icon != null) {
                iconImageView.setImageDrawable(icon.getDrawable());
                iconImageView.setVisibility(VISIBLE);
            } else {
                iconImageView.setVisibility(GONE);
            }
        }

        if (mediaView != null) {
            adView.setMediaView(mediaView);
        }

        adView.setHeadlineView(primaryTextView);
        adView.setBodyView(tertiaryTextView);
        adView.setCallToActionView(callToActionView);
        adView.setIconView(iconImageView);
        adView.setStarRatingView(ratingBar);
        adView.setStoreView(secondaryTextView);

        adView.setNativeAd(nativeAd);
    }

    public void setStyles(NativeTemplateStyle styles) {
        this.styles = styles;
        applyStyles();
    }

    private void applyStyles() {
        if (styles == null) {
            return;
        }

        NativeAdView adView = getNativeAdView();
        if (adView == null) {
            return;
        }

        ColorDrawable mainBackground = styles.getMainBackgroundColor();
        if (mainBackground != null) {
            adView.setBackground(mainBackground);
            if (primaryTextView != null) {
                primaryTextView.setBackground(mainBackground);
            }
            if (secondaryTextView != null) {
                secondaryTextView.setBackground(mainBackground);
            }
            if (tertiaryTextView != null) {
                tertiaryTextView.setBackground(mainBackground);
            }
        }

        Typeface primary = styles.getPrimaryTextTypeface();
        if (primary != null && primaryTextView != null) {
            primaryTextView.setTypeface(primary);
        }

        Typeface secondary = styles.getSecondaryTextTypeface();
        if (secondary != null && secondaryTextView != null) {
            secondaryTextView.setTypeface(secondary);
        }

        Typeface tertiary = styles.getTertiaryTextTypeface();
        if (tertiary != null && tertiaryTextView != null) {
            tertiaryTextView.setTypeface(tertiary);
        }

        Typeface cta = styles.getCallToActionTextTypeface();
        if (cta != null && callToActionView != null) {
            callToActionView.setTypeface(cta);
        }

        float primarySize = styles.getPrimaryTextSize();
        if (primarySize > 0 && primaryTextView != null) {
            primaryTextView.setTextSize(primarySize);
        }

        float secondarySize = styles.getSecondaryTextSize();
        if (secondarySize > 0 && secondaryTextView != null) {
            secondaryTextView.setTextSize(secondarySize);
        }

        float tertiarySize = styles.getTertiaryTextSize();
        if (tertiarySize > 0 && tertiaryTextView != null) {
            tertiaryTextView.setTextSize(tertiarySize);
        }

        float ctaSize = styles.getCallToActionTextSize();
        if (ctaSize > 0 && callToActionView != null) {
            callToActionView.setTextSize(ctaSize);
        }

        int primaryColor = styles.getPrimaryTextColor();
        if (primaryColor != 0 && primaryTextView != null) {
            primaryTextView.setTextColor(primaryColor);
        }

        int secondaryColor = styles.getSecondaryTextColor();
        if (secondaryColor != 0 && secondaryTextView != null) {
            secondaryTextView.setTextColor(secondaryColor);
        }

        int tertiaryColor = styles.getTertiaryTextColor();
        if (tertiaryColor != 0 && tertiaryTextView != null) {
            tertiaryTextView.setTextColor(tertiaryColor);
        }

        ColorDrawable ctaBackground = styles.getCallToActionBackgroundColor();
        if (ctaBackground != null && callToActionView != null) {
            callToActionView.setBackground(ctaBackground);
        }

        ColorDrawable primaryBackground = styles.getPrimaryTextBackgroundColor();
        if (primaryBackground != null && primaryTextView != null) {
            primaryTextView.setBackground(primaryBackground);
        }

        ColorDrawable secondaryBackground = styles.getSecondaryTextBackgroundColor();
        if (secondaryBackground != null && secondaryTextView != null) {
            secondaryTextView.setBackground(secondaryBackground);
        }

        ColorDrawable tertiaryBackground = styles.getTertiaryTextBackgroundColor();
        if (tertiaryBackground != null && tertiaryTextView != null) {
            tertiaryTextView.setBackground(tertiaryBackground);
        }
    }

    private NativeAdView getNativeAdView() {
        if (nativeAdView == null) {
            int layoutId = templateType == MEDIUM_TEMPLATE_TYPE ?
                    R.layout.gnt_medium_template_view :
                    R.layout.gnt_small_template_view;

            LayoutInflater inflater = LayoutInflater.from(getContext());
            nativeAdView = (NativeAdView) inflater.inflate(layoutId, this, true);

            primaryImageView = nativeAdView.findViewById(R.id.icon);
            primaryTextView = nativeAdView.findViewById(R.id.primary);
            secondaryTextView = nativeAdView.findViewById(R.id.secondary);
            tertiaryTextView = nativeAdView.findViewById(R.id.body);
            callToActionView = nativeAdView.findViewById(R.id.cta);
            ratingBar = nativeAdView.findViewById(R.id.rating_bar);
            mediaView = nativeAdView.findViewById(R.id.media_view);
            iconImageView = nativeAdView.findViewById(R.id.icon);
        }
        return nativeAdView;
    }
}
