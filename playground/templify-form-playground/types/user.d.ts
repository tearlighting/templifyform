import type { ELoginStatus, EPemission } from "@/constants"
export interface IUserInfo {
  name?: string
  loginId?: null
  role: EPemission
  loginStatus: ELoginStatus
}
