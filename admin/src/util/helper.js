import Config from '@/config'

//接口地址
export const apiUrl = process.env.NODE_ENV === 'development' ? Config.devUrl : Config.proUrl
