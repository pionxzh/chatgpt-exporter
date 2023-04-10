export const noop = () => {}

export function onloadSafe(fn: () => void) {
    if (document.readyState === 'complete') {
        fn()
    }
    else {
        window.addEventListener('load', fn)
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function dateStr(date: Date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function timestamp() {
    return new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')
}

export function getColorScheme(): 'light' | 'dark' {
    return document.documentElement.style.getPropertyValue('color-scheme') as 'light' | 'dark'
}

export function unixTimestampToISOString(timestamp) {
    if (!timestamp) return;
    return (new Date(timestamp * 1000)).toISOString();
}

export function unixTimestampToFormattedDashString(timestamp) {
    if (!timestamp) return;
    var date = new Date(timestamp * 1000);
    var pad = function(n) { return (n<10) ? '0'+n : n; };
    var m = date.getMonth()+1;
    var d = date.getDate();
    var y = date.getFullYear();
    var h = date.getHours();
    var ampm = (h >= 12) ? 'PM' : 'AM';
    h = h % 12;
    h = (h === 0) ? 12 : h;
    var mm = pad(date.getMinutes());
    return `${m}-${d}-${y}-${h}-${mm}-${ampm}`;
}
