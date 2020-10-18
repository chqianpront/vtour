<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div>
        审核开关 <a-switch :checked="isVerifyOpened" @change="onVerifyChange" />
      </div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="行程">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="routineQuery.selectContent" placeholder="请输入昵称/openid"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="!advanced && 8 || 24" :sm="24">
                    <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                      <a-button type="primary" @click="$refs.routineTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-select :default-value="1" style="width: 200px; margin-right: 8px;" @change="routineTypeChange" v-model="routineType">
                      <a-select-option :value="1">
                        发布时间排序
                      </a-select-option>
                      <a-select-option :value="0">
                        点赞数排序
                      </a-select-option>
                    </a-select>
                    <a-icon @click="sequnceDesc" v-show="this.sequence == 1" type="sort-ascending" />
                    <a-icon @click="sequnceAsc" v-show="this.sequence != 1" type="sort-descending" />
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <s-table
              ref="routineTable"
              size="default"
              rowKey="key"
              :columns="routineColumns"
              :data="loadRoutineData"
              showPagination="auto"
            >
              <span slot="routinePic" slot-scope="text, record">
                <template v-for="(pic, picIndex) in record.materialUrls">
                  <img v-if="!isVideo(pic)" :key="picIndex" :src="pic" style="width: 40px; margin-right: 8px; margin-top: 4px;" alt="游记图片">
                  <video v-if="isVideo(pic)" :key="picIndex" :src="pic" controls style="width: 200px; margin-right: 8px; margin-top: 4px;"></video>
                </template>
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <a @click="operateVerify(record.tripId, 1)" style="margin-right: 8px">审核操作</a>
                </template>
              </span>
              <span slot="theme" slot-scope="text, record">
                <span v-html="highl(record.theme)"></span>
              </span>
              <span slot="openId" slot-scope="text">
                <a-tooltip trigger="click">
                  <template slot="title">
                    {{text}}
                  </template>
                  <span style="cursor: pointer;">******</span>
                </a-tooltip>
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="游记">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="tourQuery.selectContent" placeholder="请输入昵称/openid"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="!advanced && 8 || 24" :sm="24">
                    <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                      <a-button type="primary" @click="$refs.tourTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <s-table
              ref="tourTable"
              size="default"
              rowKey="key"
              :columns="tourColumns"
              :data="loadTourData"
              showPagination="auto"
            >
              <span slot="routinePic" slot-scope="text, record">
                <template v-for="(pic, picIndex) in record.materialUrls">
                  <img v-if="!isVideo(pic)" :key="picIndex" :src="pic" style="width: 40px; margin-right: 8px; margin-top: 4px;" alt="游记图片">
                  <video v-if="isVideo(pic)" :key="picIndex" :src="pic" controls style="width: 200px; margin-right: 8px; margin-top: 4px;"></video>
                </template>
              </span>
              <span slot="theme" slot-scope="text, record">
                <span v-html="highl(record.theme)"></span>
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <a @click="operateVerify(record.travelId, 2)" style="margin-right: 8px">审核操作</a>
                </template>
              </span>
              <span slot="travelExperience" slot-scope="text, record">
                <span v-html="highl(record.travelExperience)"></span>
              </span>
              <span slot="openId" slot-scope="text">
                <a-tooltip trigger="click">
                  <template slot="title">
                    {{text}}
                  </template>
                  <span style="cursor: pointer;">******</span>
                </a-tooltip>
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="3" tab="评论">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="commentQuery.selectContent" placeholder="请输入昵称/openid"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="!advanced && 8 || 24" :sm="24">
                    <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                      <a-button type="primary" @click="$refs.commentTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <s-table
              ref="commentTable"
              size="default"
              rowKey="key"
              :columns="commentColumns"
              :data="loadCommentData"
              showPagination="auto"
            >
              <span slot="theme" slot-scope="text, record">
                <span v-html="highl(record.theme)"></span>
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <a @click="operateVerify(record.commentId, 3)" style="margin-right: 8px">审核操作</a>
                </template>
              </span>
              <span slot="content" slot-scope="text, record">
                <span v-html="highl(record.content)"></span>
              </span>
              <span slot="openId" slot-scope="text">
                <a-tooltip trigger="click">
                  <template slot="title">
                    {{text}}
                  </template>
                  <span style="cursor: pointer;">******</span>
                </a-tooltip>
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getExamineStatus, listExamineComments, listExamineTravels, listExamineTrips, updateExamineStatus, listAllShieldWords, examineChange } from '@/api/manage'

const commentColumns = [
  {
    title: '序号',
    dataIndex: 'serialNo'
  },
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: 'openId',
    dataIndex: 'openId',
    scopedSlots: { customRender: 'openId' }
  },
  {
    title: '主题',
    dataIndex: 'theme',
    scopedSlots: { customRender: 'theme' }
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    width: '300px',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '评论时间',
    dataIndex: 'commentTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const tourColumns = [
  {
    title: '序号',
    dataIndex: 'serialNo'
  },
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: 'openId',
    dataIndex: 'openId',
    scopedSlots: { customRender: 'openId' }
  },
  {
    title: '主题',
    dataIndex: 'theme',
    scopedSlots: { customRender: 'theme' }
  },
  {
    title: '游记内容',
    dataIndex: 'travelExperience',
    scopedSlots: { customRender: 'travelExperience' }
  },
  {
    title: '游记图片',
    dataIndex: 'materialUrls',
    scopedSlots: {
      customRender: 'routinePic'
    }
  },
  {
    title: '游记时间',
    dataIndex: 'travelTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]
const routineColumns = [
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: 'openId',
    dataIndex: 'openId',
    scopedSlots: { customRender: 'openId' }
  },
  {
    title: '行程主题',
    dataIndex: 'theme',
    scopedSlots: { customRender: 'theme' }
  },
  {
    title: '手机号',
    dataIndex: 'tripNum'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.commentColumns = commentColumns
    this.tourColumns = tourColumns
    this.routineColumns = routineColumns
    return {
      curIndex: 1,
      isVerifyOpened: false,
      advanced: false,
      seqType: 1,
      commentType: 1,
      // 查询参数
      commentQuery: {},
      // 加载数据方法 必须为 Promise 对象
      loadCommentData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.commentQuery)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        return listExamineComments(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                commentTime: itm.commentTime ? moment(itm.commentTime).format('YYYY-MM-DD HH:mm:ss') : '',
                key: index,
                rowKey: index,
                serialNo: ((res.value.pageInfo.currentPage - 1) * res.value.pageInfo.pageSize) + index + 1
              }))
              return {
                data: data,
                pageSize: 20,
                pageNo: res.value.pageInfo.currentPage,
                totalPage: res.value.pageInfo.totalPage,
                totalCount: res.value.pageInfo.totalCount
              }
            } else {
              return {
                data: [],
                pageSize: 20,
                pageNo: 1,
                totalPage: 0,
                totalCount: 0
              }
            }
          })
      },
      tourType: 1,
      // 查询参数
      tourQuery: {},
      // 加载数据方法 必须为 Promise 对象
      loadTourData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.tourQuery)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        return listExamineTravels(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                travelTime: itm.travelTime ? moment(itm.travelTime).format('YYYY-MM-DD HH:mm:ss') : '',
                key: index,
                rowKey: index,
                serialNo: ((res.value.pageInfo.currentPage - 1) * res.value.pageInfo.pageSize) + index + 1
              }))
              return {
                data: data,
                pageSize: 20,
                pageNo: res.value.pageInfo.currentPage,
                totalPage: res.value.pageInfo.totalPage,
                totalCount: res.value.pageInfo.totalCount
              }
            } else {
              return {
                data: [],
                pageSize: 20,
                pageNo: 1,
                totalPage: 0,
                totalCount: 0
              }
            }
          })
      },
      sequence: 1,
      routineType: 1,
      // 查询参数
      routineQuery: {},
      // 加载数据方法 必须为 Promise 对象
      loadRoutineData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.routineQuery)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        requestParameters.dustbinType = this.routineType
        requestParameters.sequence = this.sequence
        return listExamineTrips(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                commentTime: itm.commentTime ? moment(itm.commentTime).format('YYYY-MM-DD HH:mm:ss') : '',
                key: index,
                rowKey: index,
                serialNo: ((res.value.pageInfo.currentPage - 1) * res.value.pageInfo.pageSize) + index + 1
              }))
              return {
                data: data,
                pageSize: 20,
                pageNo: res.value.pageInfo.currentPage,
                totalPage: res.value.pageInfo.totalPage,
                totalCount: res.value.pageInfo.totalCount
              }
            } else {
              return {
                data: [],
                pageSize: 20,
                pageNo: 1,
                totalPage: 0,
                totalCount: 0
              }
            }
          })
      }
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    this.listAllShieldWords()
  },
  mounted () {
    this.getVerifyStatus()
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
      console.log(text, tText, this.shieldWords)
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
    getVerifyStatus () {
      getExamineStatus().then(ret => {
        if (ret && ret.success) {
          this.isVerifyOpened = ret.value === 1
        }
      })
    },
    isVideo (item) {
      try {
        const videoSuff = ['mp4', 'flv', 'wmv', 'asf', 'rmvb', 'mov', '3gp', 'tm', 'asx']
        // eslint-disable-next-line
        const suffList = item.split('\.')
        const suffix = suffList[suffList.length - 1]
        return videoSuff.indexOf(suffix) > -1
      } catch (error) {
        return false
      }
    },
    sequnceDesc () {
      this.sequence = 2
      this.$refs.routineTable.refresh(true)
    },
    sequnceAsc () {
      this.sequence = 1
      this.$refs.routineTable.refresh(true)
    },
    callback (index) {
      this.curIndex = index
      switch (index) {
        case 1:
          this.$refs.routineTable.refresh(true)
          break
        case 2:
          this.$refs.tourTable.refresh(true)
          break
        case 3:
          this.$refs.commentTable.refresh(true)
          break
      }
    },
    commentTypeChange (e) {
      this.$refs.commentTable.refresh(true)
    },
    tourTypeChange () {
      this.$refs.tourTable.refresh(true)
    },
    routineTypeChange () {
      this.$refs.routineTable.refresh(true)
    },
    onVerifyChange (val) {
      const d = val ? 1 : 0
      updateExamineStatus({
        status: d
      }).then(ret => {
        if (ret && ret.success) {
          this.isVerifyOpened = val
          this.$message.success(`审核开关${val ? '开启' : '关闭'}`)
        }
      })
    },
    examineChange (id, cType, type) {
      examineChange({
        contentId: id,
        contentType: cType,
        type: type
      }).then(ret => {
        if (ret && ret.success) {
          this.$message.success('信息审核成功')
          switch (this.curIndex) {
            case 1:
              this.$refs.routineTable.refresh(true)
              break
            case 2:
              this.$refs.tourTable.refresh(true)
              break
            case 3:
              this.$refs.commentTable.refresh(true)
              break
          }
        }
      })
    },
    operateVerify (id, type) {
      this.$confirm({
        title: '审核操作',
        content: '对此条信息的审核操作',
        okText: '审核通过',
        cancelText: '审核不通过',
        onOk () {
          this.examineChange(id, type, 1)
        },
        onCancel () {
          this.examineChange(id, type, 2)
        }
      })
    }
  }
}
</script>
