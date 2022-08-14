/**
 * 文章请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getUserChannels = params => {
  return request({
    methods: 'GET',
    url: '/v1_1/articles',
    // params 选项用来配置 Query 参数
    params
  })
}
