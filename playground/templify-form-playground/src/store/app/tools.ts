import { EAppSize, EDeviceType } from "@/constants/app"

const breakpoints: Record<EAppSize, string> = {
  [EAppSize.SMALL]: "(min-width: 640px)",
  [EAppSize.MEDIUM]: "(min-width: 768px)",
  [EAppSize.LARGE]: "(min-width: 1024px)",
  [EAppSize.XLARGE]: "(min-width: 1280px)",
  [EAppSize.XXLARGE]: "(min-width: 1536px)",
  [EAppSize.BASE]: "(min-width: 0px)",
}
export function getDevice(): EAppSize {
  return isSize(EAppSize.XXLARGE) || isSize(EAppSize.XLARGE) || isSize(EAppSize.LARGE) || isSize(EAppSize.MEDIUM) || isSize(EAppSize.SMALL) || EAppSize.BASE
}

const isSize = (size: EAppSize) => {
  if (window.matchMedia(breakpoints[size]).matches) {
    return size
  }
}

export const getDeviceType = (size: EAppSize) => {
  if ([EAppSize.SMALL, EAppSize.BASE].includes(size)) {
    return EDeviceType.MOBILE
  } else {
    return EDeviceType.DESKTOP
  }
}

export class Settings {
  showNavBar: boolean = true

  showMenuSwitch: boolean = true
  showTitle: boolean = true
  showFullScreenSwitch: boolean = true
  showLocaleSwitch: boolean = true
  showThemeSwitch: boolean = true
  showUserAvatar: boolean = true

  showTagsView: boolean = true
}
