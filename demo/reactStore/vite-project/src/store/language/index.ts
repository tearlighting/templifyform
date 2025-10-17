import {
  en,
  jp,
  zh,
} from '@/locale';
import {
  createLanguageCore,
  createLanguageManager,
  createLanguageManagerGlue,
} from '@/utils';

const languageManagerCoreIns = createLanguageCore()
  .register({
    label: "中文",
    value: "zh",
    message: zh,
  })
  .register({
    label: "English",
    value: "en",
    message: en,
  })
  .register({
    label: "日本語",
    value: "jp",
    message: jp,
  })

export const languageManager = createLanguageManagerGlue(languageManagerCoreIns, createLanguageManager)
