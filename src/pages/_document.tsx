import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import Script from 'next/script';
import type { Language } from '@/utils/i18n/config';

const FACEBOOK_DOMAIN_VERIFICATION: Record<Language, string> = {
  pl: 't3ojuyqbn81ecfp2vg7hi9e76z6dku',
  en: '56g5xj3u7om9cl3z709s8fvqtl105g',
};

const GTM_CONTAINER_ID: Record<Language, string> = {
  pl: 'GTM-PJNDR4N',
  en: 'GTM-P2XBWH3Q',
};

const resolveLanguage = (locale?: string): Language =>
  locale === 'en' || locale === 'pl' ? locale : 'pl';

interface MyDocumentProps extends DocumentInitialProps {
  facebookDomainVerification: string;
  gtmId: string;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const language = resolveLanguage(ctx.locale);

    return {
      ...initialProps,
      facebookDomainVerification: FACEBOOK_DOMAIN_VERIFICATION[language],
      gtmId: GTM_CONTAINER_ID[language],
    };
  }

  render(): JSX.Element {
    const { facebookDomainVerification, gtmId } = this.props;

    return (
      <Html lang="pl-PL">
        <Head>
          <meta name="p:domain_verify" content="dc185cd01a5d788baa1b5e3db0cd26a2" />
          <meta name="google-site-verification" content="vy2-u0GFd0r-WiV7izIRc9O4Jbkw4reG28gZPZryZJA" />
          {/* Meta Tags */}
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="description"
            content="Odkryj nowoczesne gałki, uchwyty meblowe, klamki i wieszaki. Stylowe akcesoria wnętrzarskie od HVYT dla wymagających klientów."
          />
          <meta
            name="keywords"
            content="uchwyty meblowe, gałki meblowe, klamki, wieszaki, akcesoria wnętrzarskie, HVYT, stylowe wnętrza"
          />
          <meta name="author" content="HVYT" />
          <meta name="robots" content="index, follow" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.png" />

          {/* Fonts & Additional Resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="https://hvyt.pl/styles.css" />

          {/* Facebook Domain Verification */}
          <meta
            name="facebook-domain-verification"
            content={facebookDomainVerification}
          />
          <meta
            name="p:domain_verify"
            content="a6786718d22d0c370bdbd44d3a3f44ee"
          />

          {/* --- Google Consent Mode v2 Default Settings --- */}
          <Script id="ga-consent" strategy="beforeInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            // Ustaw domyślny stan zgody (np. 'denied' dla nie‑istotnych danych)
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_personalization': 'denied',
              'ad_user_data': 'denied',
              'personalization_storage': 'denied',
              'functionality_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
            // Opcjonalnie: redaguj dane reklamowe i wyłącz URL passthrough
            gtag('set', 'ads_data_redaction', true);
            gtag('set', 'url_passthrough', false);
          `}
          </Script>

          {/* --- Google Tag Manager (GTM) Script --- */}
          <Script id="gtm-script" strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
          </Script>
          <Script id="clarity-script" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xxj3jhn7q9");`}
          </Script>
        </Head>
        <body className="bg-beige-light">
          {/* --- Google Tag Manager (noscript) fallback --- */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
          {/* --- Allekurier Banner Script --- */}
          <Script id="allekurier-banner" strategy="afterInteractive">
            {`
            (function (i) {
              var j = document.createElement("script");
              j.src = "https://cdn.allekurier.pl/mail-box/banner.js?hid=" + i;
              j.async = true;
              j.referrerPolicy = "no-referrer-when-downgrade";
              document.body.appendChild(j);
            })("59c63e5c-3a7e-4b8e-8165-999687ba3bc4");
          `}
          </Script>
        </body>
      </Html>
    );
  }
}
