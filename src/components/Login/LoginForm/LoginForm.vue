<template>
  <a-form ref="form" :model="loginForm" :rules="loginRules" scrollToFirstError>
    <a-row type="flex" justify="space-between">
      <!-- 国家码选择器 -->
      <a-form-item class="w-20" name="countrycode">
        <a-select
          v-model:value="loginForm.countrycode"
          @focus="getCountrycodeList"
          :getPopupContainer="triggerNode => triggerNode.parentNode || document.body"
          optionLabelProp=""
          dropdownClassName="form-select-dropdown"
        >
          <a-select-option v-for="{ zh, code } in countrycodeList" :title="code" :value="code" :key="zh" class="w-70">
            <span class="float-left">{{ zh }}</span>
            <span class="float-right text-gray-500">+{{ code }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <span>-</span>
      <!-- 手机号码 -->
      <a-form-item name="phone">
        <a-input v-model:value="loginForm.phone" placeholder="请输入手机号码" @input="inputNumber('phone')"></a-input>
      </a-form-item>
    </a-row>
    <a-row v-if="!loginForm.usePassword" type="flex" justify="space-between">
      <!-- 验证码 -->
      <a-form-item name="captcha" class="w-40 mr-4">
        <a-input v-model:value="loginForm.captcha" placeholder="请输入验证码" @input="inputNumber('captcha')"></a-input>
      </a-form-item>
      <a-button type="primary" @click.prevent="sendCaptchaHandler" class="tracking-widest">发送验证码</a-button>
    </a-row>
    <!-- 密码 -->
    <a-form-item v-else name="password" class="w-full" validateFirst>
      <a-input-password
        placeholder="请输入密码"
        v-model:value="loginForm.password"
        show-password
        validateFirst
      ></a-input-password>
    </a-form-item>
    <!-- 切换登录模式 -->
    <a
      href="javascript:;"
      class="text-xs hover:underline hover:text-red-700"
      @click="loginForm.usePassword = !loginForm.usePassword"
      >{{ loginForm.usePassword ? '短信登录' : '密码登录' }}</a
    >
    <!-- 提交表单 -->
    <a-button type="primary" class="w-full my-4 py-0 text-base" @click.prevent="submitForm">登&nbsp;&nbsp;&nbsp;录</a-button>
    <!-- 协议 -->
    <a-form-item name="agree">
      <a-checkbox v-model:checked="loginForm.agree"
        ><span class="text-xs tracking-tighter">
          <span>同意</span>
          <a
            href="https://st.music.163.com/official-terms/service"
            class="text-blue-500 hover:underline hover:text-blue-400"
            target="_blank"
            >《服务条款》</a
          >
          <a
            href="https://st.music.163.com/official-terms/privacy"
            class="text-blue-500 hover:underline hover:text-blue-400"
            target="_blank"
            >《隐私政策》</a
          >
          <a
            href="https://st.music.163.com/official-terms/children"
            class="text-blue-500 hover:underline hover:text-blue-400"
            target="_blank"
            >《儿童隐私政策》</a
          >
        </span>
      </a-checkbox>
    </a-form-item>
  </a-form>
</template>

<script>
import { errorInfo } from '@/utils'
import api from '@/api'

export default {
  data() {
    return {
      countrycodeList: [],
      isCooling: false,
      loginForm: {
        countrycode: 86,
        phone: '',
        captcha: '',
        password: '',
        usePassword: false,
        agree: false
      },
      loginRules: {
        phone: [
          {
            validator: async (_rule, value) => {
              if (!value) return Promise.reject(new Error('请输入手机号码'))
              if (this.loginForm.countrycode !== 86 && /^\d{7,11}$/.test(value)) {
                return Promise.resolve()
              } else if (/^1[3|4|5|6|7|8][\d]{9}$/.test(value)) {
                return Promise.resolve()
              } else {
                return Promise.reject(new Error('请正确输入手机号码'))
              }
            },
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            pattern: /^\d{4}$/,
            message: '请输入4位数字验证码',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' },
          {
            pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)/,
            message: '包含字母、数字、符号中至少两种',
            trigger: 'blur'
          },
          { pattern: /^\S*$/, message: '密码不能包含空格', trigger: 'blur' }
        ],
        nickname: [],
        agree: [
          {
            validator: async (_rule, value) => {
              if (value === false) {
                this.$toast('请先仔细阅读并勾选须知事项')
                return Promise.reject(new Error('请先仔细阅读并勾选须知事项'))
              } else return Promise.resolve()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 禁止输入框输入非数字字符
    inputNumber(name) {
      this.loginForm[name] = this.loginForm[name].replace(/\D/g, '')
    },
    // 异步获取国家码列表
    async getCountrycodeList() {
      if (this.countrycodeList.length !== 0) return
      const { data: res } = await api.getCtcodeList()
      this.countrycodeList = res.data.reduce((acc, cur) => {
        return acc.concat(cur.countryList)
      }, [])
    },
    // 防止连续点击
    cooldowm() {
      this.isCooling = true
      setTimeout(() => (this.isCooling = false), 5000)
    },
    // 检测手机号码是否已注册
    async checkPhoneHandler(ctcode, phone) {
      const { data: res } = await api.checkPhoneExistence(ctcode, phone)
      if (res.code !== 200) throw new Error('请求失败，请稍后重试')
      else if (res.exist === -1) throw new Error('手机号尚未注册，暂无注册功能')
      else if (res.exist === 1) return true
    },
    // 发送验证码
    async sendCaptchaHandler() {
      if (this.isCooling) return this.$toast('操作太快了，请稍等')
      const valid = await this.$refs.form.validateFields(['phone', 'agree']).catch(() => false)
      if (!valid) return false

      const { countrycode, phone } = this.loginForm
      try {
        await this.checkPhoneHandler(countrycode, phone)
        console.log('eae')
        const { data: res } = await api.sendCaptcha(countrycode, phone)
        if (res.code === 200 && res.data === true) {
          this.$toast('验证码已发送')
          this.cooldowm()
        }
      } catch (err) {
        this.$toast(errorInfo(err))
      }
    },
    // 提交表单
    async submitForm() {
      let res

      if (this.isCooling) return this.$toast('操作太快了，请稍等')
      const valid = await this.$refs.form.validateFields().catch(() => false)
      if (!valid) return false

      const { countrycode, phone, captcha, password, usePassword } = this.loginForm
      try {
        if (usePassword && (await this.checkPhoneHandler(countrycode, phone))) {
          res = await api.loginByPassword(countrycode, phone, password)
        } else {
          res = await api.loginByCaptcha(countrycode, phone, captcha)
        }
        if (res.data.account && res.data.profile) {
          this.$store.commit('setUserInfo', res.data.profile)
        } else {
          this.$store.commit('setUserInfo', null)
          throw new Error(res.data.message)
        }
        this.cooldowm()
      } catch (err) {
        this.$toast(errorInfo(err))
      }
    }
  }
}
</script>

<style>
.form-select-dropdown {
  width: 288px !important;
}
</style>
