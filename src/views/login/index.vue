<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"
                 class="page-nav-bar" />
    <!-- / 导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm"
              @submit="onSubmit">
      <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
      <van-cell-group inset>
        <van-field name='mobile'
                   placeholder="请输入手机号码"
                   v-model="user.mobile"
                   :rules="userFormRules.mobile"
                   type="number"
                   maxlength="11">
          <i slot="left-icon"
             class="iconfont icon-shouji "></i>
        </van-field>
        <van-field name='code'
                   placeholder="请输入验证码"
                   v-model="user.code"
                   :rules="userFormRules.code"
                   type="number"
                   maxlength="6">
          <i slot="left-icon"
             class="iconfont icon-yanzhengma "></i>
          <template #button>
            <!--
            time: 倒计时时间
           -->
            <van-count-down v-if="isCountDownShow"
                            :time="1000 * 5"
                            format="ss s"
                            @finish="isCountDownShow = false" />
            <van-button v-else
                        size="small"
                        native-type="button"
                        class="send-sms-btn"
                        round
                        @click="onSendSms"
                        type="default">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button block
                    type="info"
                    native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>

    <!-- /登录表单 -->
  </div>

</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码格式错误'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit (values) {
      // 1. 展示登陆中 loading
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      // 2. 请求登录
      try {
        console.log('验证失败', this.user)
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back()
      } catch (err) {
        console.log('验证失败', err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },

    async onSendSms () {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true

      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .van-cell-group {
    margin: 0;
    .van-field {
      .iconfont {
        font-size: 37px;
        color: #666666;
      }
      .send-sms-btn {
        // width: 152px;
        height: 46px;
        background-color: #ededed;
        font-size: 22px;
        color: #666;
        line-height: 22px;
      }
    }
  }
  .login-btn-wrap {
    margin: 53px 33px;
    .van-button--info {
      background: #6db4fb;
      border: none;
      font-size: 30px;
      border-radius: 10px;
    }
  }
}
</style>
