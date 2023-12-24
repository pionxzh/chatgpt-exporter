const API_MAPPING: Record<string, string> = {
    'https://chat.openai.com': 'https://chat.openai.com/backend-api',
    'https://chat.zhile.io': 'https://proxy1.fakegpt.org/api',
}

// export const baseUrl = 'https://chat.openai.com'
export const baseUrl = new URL(location.href).origin
export const apiUrl = API_MAPPING[baseUrl]

export const KEY_LANGUAGE = 'exporter:language'
export const KEY_FILENAME_FORMAT = 'exporter:filename_format'
export const KEY_OFFICIAL_JSON_FORMAT = 'exporter:official_json_format'
export const KEY_TIMESTAMP_ENABLED = 'exporter:enable_timestamp'
export const KEY_TIMESTAMP_24H = 'exporter:timestamp_24h'
export const KEY_TIMESTAMP_MARKDOWN = 'exporter:timestamp_markdown'
export const KEY_TIMESTAMP_HTML = 'exporter:timestamp_html'
export const KEY_META_ENABLED = 'exporter:enable_meta'
export const KEY_META_LIST = 'exporter:meta_list'
