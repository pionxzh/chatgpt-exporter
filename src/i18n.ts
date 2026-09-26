import { useSyncExternalStore } from 'preact/compat'
import { KEY_LANGUAGE, KEY_OAI_LOCALE } from './constants'
import en_US from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import id_ID from './locales/id.json'
import ja_JP from './locales/jp.json'
import ru from './locales/ru.json'
import tr_TR from './locales/tr.json'
import zh_Hans from './locales/zh-Hans.json'
import zh_Hant from './locales/zh-Hant.json'
import { ScriptStorage } from './utils/storage'

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

const FR = {
    name: 'Français',
    code: 'fr',
    resource: fr,
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
    FR,
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

    'fr': FR.code,
    'fr-FR': FR.code,

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

const resources = LOCALES.reduce<Record<string, Record<string, string>>>((acc, cur) => {
    acc[cur.code] = cur.resource
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

type TranslateOptions = Record<string, string | number>

let language = getDefaultLanguage()
const listeners = new Set<() => void>()

/**
 * Looks up `key` in the current language, then en-US, then returns the key itself.
 * `{{name}}` placeholders are replaced from `options`.
 */
function t(key: string, options?: TranslateOptions): string {
    const template = resources[language]?.[key] ?? resources[EN_US.code][key] ?? key
    if (!options) return template
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(options[name] ?? ''))
}

function changeLanguage(lng: string) {
    if (lng === language) return
    language = lng
    ScriptStorage.set(KEY_LANGUAGE, lng)
    listeners.forEach(listener => listener())
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

const i18n = {
    t,
    changeLanguage,
    get language() {
        return language
    },
}

const translators = new Map<string, typeof t>()
function getTranslator(lng: string) {
    let translator = translators.get(lng)
    if (!translator) {
        translator = (key, options) => t(key, options)
        translators.set(lng, translator)
    }
    return translator
}

/**
 * Re-renders the component when the language changes.
 * `t` gets a new identity per language, so hook deps on it stay correct.
 */
export function useTranslation() {
    const lng = useSyncExternalStore(subscribe, () => language)
    return { t: getTranslator(lng), i18n }
}

export default i18n
