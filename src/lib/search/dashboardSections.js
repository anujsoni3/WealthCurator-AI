import { DASHBOARD_SECTIONS } from '../constants'

export const NAV_TO_SECTION_IDS = {
  overview: null,
  analytics: ['designSystem'],
  transactions: ['transactions'],
  insights: ['insights'],
  budgets: ['budgets'],
  portfolio: ['portfolio'],
}

export function getFilteredSections(activeNavId, searchQuery) {
  const scopedSectionIds = NAV_TO_SECTION_IDS[activeNavId] ?? []
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const navScopedSections =
    scopedSectionIds === null
      ? DASHBOARD_SECTIONS
      : DASHBOARD_SECTIONS.filter((section) => scopedSectionIds.includes(section.id))

  if (!normalizedQuery) {
    return navScopedSections
  }

  return navScopedSections.filter((section) => {
    const keywords = Array.isArray(section.keywords) ? section.keywords.join(' ') : ''
    const haystack =
      `${section.id} ${section.title} ${section.description} ${keywords}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}
