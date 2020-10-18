<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回上一页"
      sub-title="评论详情"
      @back="toBack"
    />
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="">
                <a-input v-model="queryParam.selectContent" placeholder="请输入昵称/openid/手机号"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">搜索</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="avatar" slot-scope="text, record">
          <img :src="record.avatarUrl" alt="头像">
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="openId" slot-scope="text">
          <a-tooltip trigger="click">
            <template slot="title">
              {{text}}
            </template>
            <span style="cursor: pointer;">******</span>
          </a-tooltip>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="commentDetail(record)" style="margin-right: 8px;">行程详情</a>
            <a @click="deleteComment(record)">删除评论</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { commentList, deleteComment } from '@/api/manage'

const columns = [
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
    title: '手机号',
    dataIndex: 'tripNum'
  },
  {
    title: '评论行程',
    dataIndex: 'theme'
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    width: '300px'
  },
  {
    title: '评论时间',
    dataIndex: 'commentTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        tripId: this.tripId,
        pageNum: 20
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.tripId = this.tripId
        console.log('loadData request parameters:', requestParameters)
        return commentList(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                commentTime: itm.commentTime ? moment(itm.commentTime).format('YYYY-MM-DD HH:mm:ss') : '',
                rowKey: index,
                key: index,
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
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.tripId = this.$route.query.id
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
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
  methods: {
    toBack () {
      this.$router.go(-1)
    },
    deleteComment (item) {
      deleteComment(item.commentId).then(ret => {
        if (ret && ret.success) {
          this.$message.success('评论删除成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    routineDetail (item) {

    },
    commentDetail (item) {

    },
    userDetail () {

    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
