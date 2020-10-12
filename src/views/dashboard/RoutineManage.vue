<template>
  <page-header-wrapper>
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
        <span slot="routinePic" slot-scope="text, record">
          <template v-for="(pic, picIndex) in record.materialUrls">
            <img v-if="!isVideo(pic)" :key="picIndex" :src="pic" style="width: 40px; margin-right: 8px; margin-top: 4px;" alt="游记图片">
            <video v-if="isVideo(pic)" :key="picIndex" :src="pic" controls style="width: 200px; margin-right: 8px; margin-top: 4px;"></video>
          </template>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="tourDetail(record)" style="margin-right: 8px;">行程详情</a>
            <a @click="deleteRoutine(record)">删除游记</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listTravel, deleteTravel } from '@/api/manage'

const columns = [
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: 'openId',
    dataIndex: 'openId'
  },
  {
    title: '手机号',
    dataIndex: 'tripNum'
  },
  {
    title: '行程主题',
    dataIndex: 'theme'
  },
  {
    title: '游记内容',
    dataIndex: 'travelExperience'
  },
  {
    title: '游记图片',
    dataIndex: 'routinePic',
    scopedSlots: {
      customRender: 'routinePic'
    }
  },
  {
    title: '游记发布时间',
    dataIndex: 'travelTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
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
        currentPage: 1,
        pageNum: 20,
        tripId: this.tripId,
        openId: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        requestParameters.tripId = this.tripId
        requestParameters.currentPage = parameter.pageNo
        return listTravel(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                travelTime: itm.travelTime ? moment(itm.travelTime).format('YYYY-MM-DD HH:mm:ss') : '',
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
    toBack () {
      this.$router.replace({
        path: '/article-manage'
      })
    },
    deleteRoutine (item) {
      deleteTravel(item.travelId).then(ret => {
        if (ret) {
          this.$message.success('游记删除成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    tourDetail (item) {
      this.$router.push({
        path: '/article/tour',
        query: {
          id: item.tripId
        }
      })
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
