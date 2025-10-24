import i18n from 'i18next';
import type { ILanguageManager } from 'language';
import { initReactI18next } from 'react-i18next';

export class LanguageManager implements ILanguageManager {
    private _initialized = false
    //react 是扔在Provider中的，不需要install操作什么
    install(): void { }

    init<TMessage extends Record<string, any>>(messages: TMessage, defaultLocale?: keyof TMessage) {
        if (this._initialized) return
        const firstLocale = defaultLocale ?? Object.keys(messages)[0]
        i18n.use(initReactI18next).init({
            lng: firstLocale as string,
            resources: Object.entries(messages).reduce((acc, [locale, msg]) => {
                acc[locale] = { translation: msg }
                return acc
            }, {} as Record<string, { translation: any }>),
            interpolation: { escapeValue: false },
        })
        this._initialized = true
        return this as any as LanguageManager
    }

    setLocale(locale: string): void {
        i18n.changeLanguage(locale)
    }
    t(path: string): string {
        if (!this._initialized) throw new Error("i18n not initialized")
        let res = ""

        const result = i18n.t(path)

        //拿到的是对象，而不是字符串
        if (result.includes(" object instead of string.")) {
            res = path
            const newPath = `${path}._`
            const handledRes = i18n.t(newPath)
            if (!handledRes.includes(" object instead of string.")) {
                res = handledRes
            }
        } else {
            res = result
        }
        return res
    }
}

export const createLanguageManager = () => new LanguageManager()
