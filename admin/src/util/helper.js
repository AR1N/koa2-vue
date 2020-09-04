import Config from '@/config/index'

//接口地址
export const apiUrl = process.env.NODE_ENV === 'development' ? Config.devApiAlias : Config.proUrl
