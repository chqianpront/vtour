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
            <a-col :md="8" :sm="24">
              <a-select :default-value="1" style="width: 200px; margin-right: 8px;" @change="handleChange" v-model="seqType">
                <a-select-option :value="1">
                  发布时间排序
                </a-select-option>
                <a-select-option :value="2">
                  用户注册时间排序
                </a-select-option>
              </a-select>
              <a-icon @click="sequnceDesc" v-show="this.sequence == 1" type="sort-ascending" />
              <a-icon @click="sequnceAsc" v-show="this.sequence != 1" type="sort-descending" />
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
          <img style="width: 30px" :src="record.avatarUrl" alt="头像">
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="userDetail(record)">详情</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal v-model="visible" title="用户详情">
      <template slot="footer">
        <a-button @click="deleteUser()">删除</a-button>
        <a-button type="primary" @click="forbid()">禁用</a-button>
      </template>
      <div>
        <div style="margin-bottom: 20px;">
          <p style="margin: 0;">基本资料</p>
          <div style="padding: 20px; background: #e5e5e5;">
            <a-row>
              <a-col :span="8">
                客户昵称:
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.nickName }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                手机号：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.tripNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                openId：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.openId }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                首次登录时间：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.firstLoginTime }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                最近登录时间：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.leastLoginTime }}
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <div>
        <div>
          <p style="margin: 0;">其他信息</p>
          <div style="padding: 20px; background: #e5e5e5;">
            <a-row>
              <a-col :span="8">
                行程发布量:
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.travelNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                游记发布量:
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.tripNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                关注量：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.fensNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                点赞数：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.praiseNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                评论数：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.commentNum }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                收藏数：
              </a-col>
              <a-col :span="16">
                {{ userDetailInfo.collectNum }}
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { userList, userDetail, operateUser } from '@/api/manage'

const columns = [
  {
    title: '序号',
    dataIndex: 'serialNo'
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
    dataIndex: 'openId'
  },
  {
    title: '绑定号码',
    dataIndex: ''
  },
  {
    title: '绑定时间',
    dataIndex: 'gmtCreate'
  },
  {
    title: '行程发布量',
    dataIndex: 'tripNum'
  },
  {
    title: '关注数',
    dataIndex: 'fensNum'
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
      queryParam: {},
      seqType: 1,
      sequence: 1,
      selectContent: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        requestParameters.seqType = this.seqType
        requestParameters.sequnce = this.sequnce
        requestParameters.selectContent = this.queryParam.selectContent
        console.log('loadData request parameters:', requestParameters, parameter, this.queryParam)
        return userList(requestParameters)
          .then(res => {
            if (res && res.success) {
              const data = res.value.data.map((itm, index) => ({
                ...itm,
                gmtCreate: itm.gmtCreate ? moment(itm.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : '',
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
      selectedRows: [],
      userDetailInfo: {}
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
    userDetail (item) {
      console.log(item)
      userDetail({
        openId: item.openId
      }).then(ret => {
        if (ret) {
          this.userDetailInfo = ret.value
          this.userDetailInfo.firstLoginTime = ret.value.firstLoginTime ? moment(ret.value.firstLoginTime).format('YYYY-MM-DD HH:mm:ss') : ''
          this.userDetailInfo.leastLoginTime = ret.value.leastLoginTime ? moment(ret.value.leastLoginTime).format('YYYY-MM-DD HH:mm:ss') : ''
          this.visible = true
        }
      })
    },
    deleteUser () {
      operateUser({
        openId: this.userDetailInfo.openId,
        type: 1
      }).then(ret => {
        if (ret) {
          this.$refs.table.reload()
        }
      })
    },
    forbid () {
      operateUser({
        openId: this.userDetailInfo.openId,
        type: 2
      }).then(ret => {
        if (ret) {
          this.$refs.table.reload()
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
