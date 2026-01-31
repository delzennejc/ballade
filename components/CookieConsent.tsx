'use client'

import ReactCookieConsent from 'react-cookie-consent'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CookieConsent() {
  const { t } = useLanguage()

  return (
    <ReactCookieConsent
      location="bottom"
      buttonText={t('cookieAccept')}
      declineButtonText={t('cookieDecline')}
      enableDeclineButton
      setDeclineCookie={false}
      cookieName="ballade-cookie-consent"
      style={{
        background: '#1e293b',
        alignItems: 'center',
        padding: '8px 16px',
        fontSize: '13px',
      }}
      buttonStyle={{
        background: '#3b82f6',
        color: 'white',
        fontSize: '12px',
        borderRadius: '4px',
        padding: '5px 12px',
        fontWeight: '500',
        margin: '0 4px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '1px solid #64748b',
        color: 'white',
        fontSize: '12px',
        borderRadius: '4px',
        padding: '5px 12px',
        fontWeight: '500',
        margin: '0 4px',
      }}
      contentStyle={{
        flex: '1 0 200px',
        margin: '4px 0',
      }}
    >
      {t('cookieConsentMessage')}
    </ReactCookieConsent>
  )
}
