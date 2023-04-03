import i18n from '@/plugins/i18n'
import { useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import colors from 'vuetify/lib/util/colors'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import 'vuetify/styles'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: colors.blue.base,
          secondary: colors.amber.base
        }
      }
    }
  }
})
