/* eslint-disable no-param-reassign */

import BaseLayout from '../layouts/Base'

/**
 * config base layout
 * @param {import('next/types').NextPage<any>} Page
 * @param {object} layoutOptions
 * @param {boolean} layoutOptions.bgWhite
 * @param {boolean} layoutOptions.bottomCTA
 * @param {boolean} layoutOptions.requireAuth
 * @param {boolean} layoutOptions.bottomNavigation
 * @returns {import('next/types').NextPage<any>}
 */
function withBaseLayout(Page, layoutOptions = {}) {
  Page.layout = BaseLayout
  Page.layoutOptions = layoutOptions

  return Page
}

export default withBaseLayout
