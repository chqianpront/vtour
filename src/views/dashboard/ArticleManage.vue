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
            <!-- <a-col :md="8" :sm="24">
              <a-select :default-value="1" style="width: 200px; margin-right: 8px;" @change="handleChange" v-model="seqType">
                <a-select-option :value="1">
                  发布时间排序
                </a-select-option>
                <a-select-option :value="2">
                  点赞数排序
                </a-select-option>
                <a-select-option :value="3">
                  发布量排序
                </a-select-option>
                <a-select-option :value="4">
                  评论数排序
                </a-select-option>
                <a-select-option :value="4">
                  收藏数排序
                </a-select-option>
                <a-select-option :value="4">
                  关注数排序
                </a-select-option>
              </a-select>
              <a-icon @click="sequnceDesc" v-show="this.sequence == 1" type="sort-ascending" />
              <a-icon @click="sequnceAsc" v-show="this.sequence != 1" type="sort-descending" />
            </a-col> -->
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
          <img :src="record.avatarUrl" style="width: 30px" alt="头像">
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="openId" slot-scope="text">
          <a-tooltip trigger="click">
            <template slot="title">
              {{ text }}
            </template>
            <span style="cursor: pointer;">******</span>
          </a-tooltip>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-tooltip>
              <template slot="title">
                查看行程
              </template>
              <a @click="tourDetail(record)" style="margin-right: 8px"><a-icon type="calendar" /></a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                游记详情
              </template>
              <a @click="routineDetail(record)" style="margin-right: 8px"><a-icon type="edit" /></a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                评论详情
              </template>
              <a @click="commentDetail(record)" style="margin-right: 8px"><a-icon type="message" /></a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                推荐
              </template>
              <a @click="recommend(record)" style="margin-right: 8px">推</a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                置顶
              </template>
              <a @click="getToTop(record)" style="margin-right: 8px">顶</a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                删除行程
              </template>
              <a @click="toDeleteRoutine(record)" style="margin-right: 8px; color: red">删</a>
            </a-tooltip>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal
      v-model="selectDateVisible"
      title="选择时间段"
      @ok="operateTrip"
      okText="确定"
      cancelText="取消">
      <a-range-picker v-model="dateRange" showTime format="YYYY-MM-DD HH:mm:ss"/>
    </a-modal>
    <a-modal
      v-model="deleteRoutineVisible"
      title="删除理由"
      okText="删除"
      cancelText="取消"
      @ok="deleteRoutine"
      @cancel="deleteRoutineVisible = false">
      <a-textarea placeholder="请填写删除理由" :rows="4" v-model="deleteMsg"/>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { tripList, operateTrip, deleteTrips } from '@/api/manage'

const columns = [
  {
    title: '序号',
    dataIndex: 'serialNo'
  },
  {
    title: '行程标题',
    dataIndex: 'theme',
    width: '300px'
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    scopedSlots: { customRender: 'avatar' }
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
    title: '点赞数',
    dataIndex: 'praiseNum',
    sorter: true
  },
  {
    title: '评论数',
    dataIndex: 'commentNum'
  },
  {
    title: '收藏数',
    dataIndex: 'collectNum'
  },
  {
    title: '是否公开',
    dataIndex: 'isOpen'
  },
  {
    title: '行程创建时间',
    dataIndex: 'tripCreateTime',
    sorter: true
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
      deleteMsg: '',
      deleteRoutineVisible: false,
      toDeleteRoutineItem: null,
      selectDateVisible: false,
      dateRange: [moment(), moment()],
      aItem: null,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      seqType: 1,
      sequence: 1,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        requestParameters.seqType = this.getSeqType(parameter.sortField)
        requestParameters.sequence = this.getSequnce(parameter.sortOrder)
        console.log('loadData request parameters:', requestParameters)
        return tripList(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                isOpen: itm.isOpen ? '公开' : '不公开',
                tripCreateTime: itm.tripCreateTime ? moment(itm.tripCreateTime).format('YYYY-MM-DD HH:mm:ss') : '',
                key: index,
                rowKey: index,
                serialNo: ((res.value.pageInfo.currentPage - 1) * res.value.pageInfo.pageSize) + index + 1
              }))
              return {
                data: data,
                pageSize: res.value.pageInfo.pageSize,
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
    toDeleteRoutine (item) {
      this.deleteMsg = ''
      this.toDeleteRoutineItem = item
      this.deleteRoutineVisible = true
    },
    deleteRoutine () {
      deleteTrips({
        id: this.toDeleteRoutineItem.tripId,
        deleteMsg: this.deleteMsg
      }).then(ret => {
        if (ret) {
          this.$message.success('游记删除成功')
          this.$refs.table.refresh(true)
          this.deleteRoutineVisible = false
        }
      })
    },
    getSequnce (str) {
      switch (str) {
        case 'ascend':
          return 1
        case 'descend':
          return 2
        default:
          return undefined
      }
    },
    getSeqType (str) {
      switch (str) {
        case 'tripCreateTime':
          return 1
        case 'praiseNum':
          return 2
        default:
          return undefined
      }
    },
    sequnceDesc () {
      this.sequence = 2
      this.$refs.table.refresh(true)
    },
    sequnceAsc () {
      this.sequence = 1
      this.$refs.table.refresh(true)
    },
    handleChange () {
      this.$refs.table.refresh(true)
    },
    getToTop (item) {
      this.aItem = Object.assign({}, item, {
        type: 2
      })
      this.selectDateVisible = true
    },
    recommend (item) {
      const param = {
        topEnd: null,
        topStart: null,
        tripId: item.tripId,
        type: 1
      }
      operateTrip(param).then(ret => {
        if (ret && ret.success) {
          this.$message.success(`文章推荐成功`)
        } else {
          this.$message.error(`文章推荐失败`)
        }
      })
    },
    operateTrip () {
      const param = {
        topEnd: moment(this.dateRange[0]).valueOf(),
        topStart: moment(this.dateRange[1]).valueOf(),
        tripId: this.aItem.tripId,
        type: this.aItem.type
      }
      operateTrip(param).then(ret => {
        if (ret && ret.success) {
          this.$message.success(`文章${this.aItem.type === 1 ? '推荐' : '置顶'}成功`)
        } else {
          this.$message.error(`文章${this.aItem.type === 1 ? '推荐' : '置顶'}失败`)
        }
        this.selectDateVisible = false
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
    routineDetail (item) {
      this.$router.push({
        path: '/article/routine',
        query: {
          id: item.tripId
        }
      })
    },
    commentDetail (item) {
      this.$router.push({
        path: '/article/comment',
        query: {
          id: item.tripId
        }
      })
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
