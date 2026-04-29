const SCRIPT_ID = 'wealthcurator-ga4-script'

function injectGtagScript(measurementId) {
  if (document.getElementById(SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export function initGA4(measurementId) {
  if (!measurementId || typeof window === 'undefined') {
    return
  }

  injectGtagScript(measurementId)

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
  })
}
