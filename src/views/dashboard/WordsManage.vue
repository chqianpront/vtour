<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="">
                <a-input v-model="queryParam.searchContent" placeholder="请输入搜索的屏蔽词"/>
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
      <div style="margin-bottom: 20px;">
        <a-button type="primary" @click="addWords">新增屏蔽词</a-button>
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

        <span slot="action" slot-scope="text, record">
          <template>
            <a-tooltip>
              <template slot="title">
                更改屏蔽词
              </template>
              <a @click="modify(record)" style="margin-right: 8px"><a-icon type="edit" /></a>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                删除屏蔽词
              </template>
              <a @click="del(record)" style="margin-right: 8px"><a-icon type="delete" /></a>
            </a-tooltip>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal v-model="visible" title="修改屏蔽词" ok-text="修改" cancel-text="取消" @ok="handleOk">
      <a-input placeholder="请输入修改的屏蔽词" v-model="toModifyWord"></a-input>
    </a-modal>
    <a-modal v-model="addNewVisible" title="新增屏蔽词" ok-text="新增" cancel-text="取消" @ok="handleAdd">
      <a-input placeholder="请输入新增的屏蔽词" v-model="toAddWord"></a-input>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listShieldWords, deleteShieldWords, addShieldWords, updateShieldWords } from '@/api/manage'

const columns = [
  {
    title: '序号',
    dataIndex: 'serialNo'
  },
  {
    title: '屏蔽词',
    dataIndex: 'shieldWords'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime'
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
      addNewVisible: false,
      confirmLoading: false,
      toModifyWord: '',
      toAddWord: '',
      toModifyWordItem: null,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        requestParameters.searchContent = this.queryParam.searchContent ? this.queryParam.searchContent : ''
        console.log('loadData request parameters:', requestParameters, this.queryParam)
        return listShieldWords(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                updateTime: itm.gmtUpdate ? moment(itm.gmtUpdate).format('YYYY-MM-DD HH:mm:ss') : '',
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
    addWords () {
      this.addNewVisible = true
    },
    handleAdd () {
      if (this.toAddWord) {
        this.addNewVisible = false
        addShieldWords({
          shieldWords: this.toAddWord
        }).then(ret => {
          if (ret && ret.success) {
            this.$message.success('屏蔽词添加成功')
            this.$refs.table.refresh(true)
          }
        })
      }
    },
    handleOk () {
      this.visible = false
      updateShieldWords({
        shieldId: this.toModifyWordItem.shieldId,
        shieldWords: this.toModifyWord
      }).then(ret => {
        if (ret && ret.success) {
          this.$message.success('屏蔽词修改成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    modify (item) {
      this.visible = true
      this.toModifyWordItem = item
    },
    del (item) {
      deleteShieldWords(item.shieldId).then(ret => {
        if (ret && ret.success) {
          this.$message.success('屏蔽词删除成功')
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
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
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
