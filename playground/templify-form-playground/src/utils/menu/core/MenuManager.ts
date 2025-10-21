import { EMenuState } from "@/constants/menu"

export class MenuController {
  private _state: EMenuState

  constructor(initial: EMenuState = EMenuState.EXPANDED) {
    this._state = initial
  }

  get current() {
    return this._state
  }

  // 切换展开 / 折叠
  toggleCollapse() {
    this._state = this._state === EMenuState.COLLAPSED ? EMenuState.EXPANDED : EMenuState.COLLAPSED
  }
  toggleHidden() {
    this._state = this._state === EMenuState.HIDDEN ? EMenuState.EXPANDED : EMenuState.HIDDEN
  }

  // 显示菜单
  show() {
    this._state = EMenuState.EXPANDED
  }

  // 折叠菜单
  collapse() {
    this._state = EMenuState.COLLAPSED
  }

  // 隐藏菜单
  hide() {
    this._state = EMenuState.HIDDEN
  }

  // 判断状态
  isExpanded() {
    return this._state === EMenuState.EXPANDED
  }

  isCollapsed() {
    return this._state === EMenuState.COLLAPSED
  }

  isHidden() {
    return this._state === EMenuState.HIDDEN
  }
}

export const createMenuManager = (initial: EMenuState = EMenuState.EXPANDED) => new MenuController(initial)
