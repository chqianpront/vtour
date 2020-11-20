<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回上一页"
      sub-title="行程详情"
      @back="toBack"
    />
    <div style="padding: 20px 40px">
      <a-card style="width: 100%; margin-bottom: 20px">
        <p style="color: #999; font-size: 16px">
          <span>用户资料</span>
          <!-- <img :src="tripDetail.avatarUrl" alt=""> -->
        </p>
        <p>
          <span>昵称：</span>
          <span v-html="highl(tripDetail.nickName)"></span>
        </p>
        <p>
          <span>手机号：</span>
          <span>{{ tripDetail.memberNum }}</span>
        </p>
        <p>
          <span>openId：</span>
          <a-tooltip trigger="click">
            <template slot="title">
              {{tripDetail.openId}}
            </template>
            <span style="cursor: pointer;">******</span>
          </a-tooltip>
        </p>
      </a-card>
      <a-card style="width: 100%; margin-bottom: 20px;">
        <p style="color: #999">
          <span>行程主题：</span>
          <span v-html="highl(tripDetail.theme)"></span>
        </p>
        <p style="color: #999">
          <span>发布时间：</span>
          <span>{{ tripDetail.tripCreate }}</span>
        </p>
        <p style="margin-left: 40px">
          <span>行程计划：</span>
          <a-steps v-for="(tourItem, tourIndex) in tripDetail.tripAgendas" progress-dot :key="tourIndex" :current="tripDetail.tripAgendas.length - 1" direction="vertical">
            <a-step v-for="(agendaItem, agendaIndex) in tourItem.agendaDetails" :key="agendaIndex">
              <template slot="title">
                <span v-html="highl(agendaItem.city)"></span>
              </template>
              <template slot="description">
                <span v-html="highl('-' + agendaItem.plan + ' \t' + agendaItem.location)"></span>
              </template>
            </a-step>
          </a-steps>
        </p>
        <p>
          团友：10人    游记：{{ tripDetail.travelNum }}    点赞：{{ tripDetail.praiseNum }}     关注：{{ tripDetail.attentionNum }}     收藏：{{ tripDetail.collectNum }}    评论：{{ tripDetail.commentNum }}   转发：{{ tripDetail.forwardNum }}
        </p>
      </a-card>
      <a-button @click="toDeleteTrip" type="primary">删除行程</a-button>
    </div>
    <a-modal v-model="visible" title="删除行程" ok-text="提交" cancel-text="取消" @ok="handleOk">
      <a-input placeholder="请输入行程删除理由（限30字）" v-model="deleteReason"></a-input>
    </a-modal>
  </div>
</template>
<style>
.ant-steps-item-content {
  width: 600px!important;
}
</style>
<script>
import moment from 'moment'
import { tripDetail, deleteTrips, listAllShieldWords } from '@/api/manage'
export default {
  data () {
    return {
      id: null,
      tripDetail: {},
      visible: false,
      deleteReason: '',
      shieldWords: []
    }
  },
  created () {
    this.listAllShieldWords()
  },
  mounted () {
    this.id = this.$route.query.id
    tripDetail(this.id).then(ret => {
      if (ret) {
        this.tripDetail = ret.value
        this.tripDetail.tripCreate = ret.value.tripCreate ? moment(ret.value.tripCreate).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    })
  },
  methods: {
    highl: function (text) {
      if (!text || !this.shieldWords) {
        return text
      }
      let tText = text
      this.shieldWords.forEach(itm => {
        const reg = new RegExp(itm.shieldWords, 'g')
        const replaceStr = `<span style="color: red;">${itm.shieldWords}</span>`
        tText = tText.replace(reg, replaceStr)
      })
      return tText
    },
    listAllShieldWords () {
      listAllShieldWords().then(ret => {
        if (ret && ret.success) {
          const tSet = new Set()
          for (let index = 0; index < ret.value.length; index++) {
            const element = ret.value[index]
            tSet.add(element)
          }
          this.shieldWords = [...tSet]
        }
      })
    },
    toBack () {
      this.$router.go(-1)
    },
    toDeleteTrip () {
      this.visible = true
      this.deleteReason = ''
    },
    handleOk () {
      this.visible = false
      this.deleteTrip()
    },
    handleCancel () {
      this.visible = false
    },
    deleteTrip () {
      deleteTrips({
        id: this.id,
        deleteMsg: this.deleteReason
      }).then(ret => {
        if (ret) {
          this.visible = false
          this.$message.success('行程删除成功')
          this.$router.back()
        }
      })
    }
  }
}
</script>
