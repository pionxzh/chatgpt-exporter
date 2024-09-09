import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { KEY_LANGUAGE, KEY_OAI_LOCALE } from './constants'
import en_US from './locales/en.json'
import es from './locales/es.json'
import id_ID from './locales/id.json'
import ja_JP from './locales/jp.json'
import ru from './locales/ru.json'
import tr_TR from './locales/tr.json'
import zh_Hans from './locales/zh-Hans.json'
import zh_Hant from './locales/zh-Hant.json'
import { ScriptStorage } from './utils/storage'

declare module 'i18next' {
    // Refs: https://www.i18next.com/overview/typescript#argument-of-type-defaulttfuncreturn-is-not-assignable-to-parameter-of-type-xyz
    interface CustomTypeOptions {
        returnNull: false
    }
}

interface Locale {
    name: string
    code: string
    aliases?: string[]
    resource: Record<string, string>
}

const EN_US = {
    name: 'English',
    code: 'en-US',
    resource: en_US,
}

const ES = {
    name: 'Español',
    code: 'es',
    resource: es,
}

const ID_ID = {
    name: 'Indonesia',
    code: 'id-ID',
    resource: id_ID,
}

const JA_JP = {
    name: '日本語',
    code: 'ja-JP',
    resource: ja_JP,
}

const RU = {
    name: 'Русский',
    code: 'ru',
    resource: ru,
}

const TR_TR = {
    name: 'Türkçe',
    code: 'tr-TR',
    resource: tr_TR,
}

const ZH_Hans = {
    name: '简体中文',
    code: 'zh-Hans',
    resource: zh_Hans,
}

const ZH_Hant = {
    name: '繁體中文',
    code: 'zh-Hant',
    resource: zh_Hant,
}

export const LOCALES: Locale[] = [
    EN_US,
    ES,
    ID_ID,
    JA_JP,
    RU,
    TR_TR,
    ZH_Hans,
    ZH_Hant,
]

// choose language code from https://www.techonthenet.com/js/language_tags.php
const LanguageMapping: Record<string, string> = {
    'en': EN_US.code,
    'en-US': EN_US.code,

    'es': ES.code,
    'es-ES': ES.code,
    'es-AR': ES.code,
    'es-CL': ES.code,
    'es-CO': ES.code,
    'es-MX': ES.code,
    'es-US': ES.code,
    'id': ID_ID.code,
    'id-ID': ID_ID.code,

    'ja': JA_JP.code,
    'ja-JP': JA_JP.code,

    'ru': RU.code,
    'ru-RU': RU.code,

    'tr': TR_TR.code,
    'tr-TR': TR_TR.code,

    'zh': ZH_Hans.code,
    'zh-CN': ZH_Hans.code,
    'zh-MO': ZH_Hans.code,
    'zh-SG': ZH_Hans.code,
    'zh-Hans': ZH_Hans.code,

    'zh-HK': ZH_Hant.code,
    'zh-TW': ZH_Hant.code,
    'zh-Hant': ZH_Hant.code,
}

const resources = LOCALES.reduce<Record<string, { translation: Record<string, string> }>>((acc, cur) => {
    acc[cur.code] = { translation: cur.resource }
    return acc
}, {})

function standardizeLanguage(language: string | null) {
    if (!language) return null

    if (language in LanguageMapping) return LanguageMapping[language]

    const shortLang = language.split('-')[0]
    if (shortLang in LanguageMapping) return LanguageMapping[shortLang]

    return null
}

function getNavigatorLanguage() {
    const { language, languages } = navigator
    if (language) return language

    if (languages && languages.length) {
        return languages[0]
    }

    return null
}

function getOaiLanguage() {
    const storedLanguage = window?.localStorage?.getItem(KEY_OAI_LOCALE)
    return storedLanguage?.replace(/^"(.*)"$/, '$1') ?? null
}

function getDefaultLanguage() {
    const storedLanguage = ScriptStorage.get<string>(KEY_LANGUAGE)
    const oaiLanguage = getOaiLanguage()
    const browserLanguage = getNavigatorLanguage()

    return standardizeLanguage(storedLanguage)
        ?? standardizeLanguage(oaiLanguage)
        ?? standardizeLanguage(browserLanguage)
        ?? EN_US.code
}

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: EN_US.code,
        lng: getDefaultLanguage(),
        debug: process.env.NODE_ENV === 'development',
        resources,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    })

i18n.on('languageChanged', (lng) => {
    ScriptStorage.set(KEY_LANGUAGE, lng)
})

export default i18n
