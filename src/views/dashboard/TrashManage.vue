<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="评论">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="commentQuery.selectContent" placeholder="请输入昵称/openid" />
                    </a-form-item>
                  </a-col>
                  <a-col :md="(!advanced && 8) || 24" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.commentTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-select
                      :default-value="1"
                      style="width: 200px; margin-right: 8px"
                      @change="commentTypeChange"
                      v-model="commentType"
                    >
                      <a-select-option :value="1"> 审核不通过的垃圾 </a-select-option>
                      <a-select-option :value="0"> 删除的垃圾 </a-select-option>
                    </a-select>
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
            ></s-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="游记">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="tourQuery.selectContent" placeholder="请输入昵称/openid" />
                    </a-form-item>
                  </a-col>
                  <a-col :md="(!advanced && 8) || 24" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.tourTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-select
                      :default-value="1"
                      style="width: 200px; margin-right: 8px"
                      @change="tourTypeChange"
                      v-model="tourType"
                    >
                      <a-select-option :value="1"> 审核不通过的垃圾 </a-select-option>
                      <a-select-option :value="0"> 删除的垃圾 </a-select-option>
                    </a-select>
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
                  <img
                    v-if="!isVideo(pic)"
                    @click="popImg(pic)"
                    :key="picIndex"
                    :src="pic"
                    style="width: 40px; margin-right: 8px; margin-top: 4px; cursor: pointer"
                    alt="游记图片"
                  />
                  <video
                    v-if="isVideo(pic)"
                    :key="picIndex"
                    :src="pic"
                    controls
                    style="width: 200px; margin-right: 8px; margin-top: 4px"
                  ></video>
                </template>
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="3" tab="行程">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="">
                      <a-input v-model="routineQuery.selectContent" placeholder="请输入昵称/openid" />
                    </a-form-item>
                  </a-col>
                  <a-col :md="(!advanced && 8) || 24" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                    >
                      <a-button type="primary" @click="$refs.routineTable.refresh(true)">搜索</a-button>
                    </span>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-select
                      :default-value="1"
                      style="width: 200px; margin-right: 8px"
                      @change="routineTypeChange"
                      v-model="routineType"
                    >
                      <a-select-option :value="1"> 审核不通过的垃圾 </a-select-option>
                      <a-select-option :value="0"> 删除的垃圾 </a-select-option>
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
                  <img
                    v-if="!isVideo(pic)"
                    @click="popImg(pic)"
                    :key="picIndex"
                    :src="pic"
                    style="width: 40px; margin-right: 8px; margin-top: 4px; cursor: pointer"
                    alt="游记图片"
                  />
                  <video
                    v-if="isVideo(pic)"
                    :key="picIndex"
                    :src="pic"
                    controls
                    style="width: 200px; margin-right: 8px; margin-top: 4px"
                  ></video>
                </template>
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal v-model="imgVisible" title="行程图片" cancel-text="取消" ok-text="确认" width="900px">
      <div>
        <img style="display: block; margin: 0 auto; max-width: 800px" :src="popImgSrc" alt="行程图片" />
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listDustComments, listDustTravels, listDustTrips } from '@/api/manage'

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
    dataIndex: 'openId'
  },
  {
    title: '主题',
    dataIndex: 'theme'
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    width: '300px'
  },
  {
    title: '删除原因',
    dataIndex: 'deleteMsg'
  },
  {
    title: '评论时间',
    dataIndex: 'commentTime'
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
    dataIndex: 'openId'
  },
  {
    title: '主题',
    dataIndex: 'theme'
  },
  {
    title: '游记内容',
    dataIndex: 'travelExperience'
  },
  {
    title: '游记图片',
    dataIndex: 'materialUrls',
    scopedSlots: {
      customRender: 'routinePic'
    }
  },
  {
    title: '删除原因',
    dataIndex: 'deleteMsg'
  },
  {
    title: '游记时间',
    dataIndex: 'travelTime'
  }
]
const routineColumns = [
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
    title: '删除原因',
    dataIndex: 'deleteMsg'
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
      popImgSrc: null,
      imgVisible: false,
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
        requestParameters.dustbinType = this.commentType
        return listDustComments(requestParameters)
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
      tourType: 1,
      // 查询参数
      tourQuery: {},
      // 加载数据方法 必须为 Promise 对象
      loadTourData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.tourQuery)
        requestParameters.currentPage = parameter.pageNo
        requestParameters.pageNum = parameter.pageSize
        requestParameters.dustbinType = this.tourType
        return listDustTravels(requestParameters)
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
        return listDustTrips(requestParameters)
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
  methods: {
    popImg (src) {
      this.popImgSrc = src
      this.imgVisible = true
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
      switch (index) {
        case 1:
          this.$refs.commentTable.refresh(true)
          break
        case 2:
          this.$refs.tourTable.refresh(true)
          break
        case 3:
          this.$refs.routineTable.refresh(true)
          break
      }
    },
    commentTypeChange (e) {
      console.log(e)
      this.$refs.commentTable.refresh(true)
    },
    tourTypeChange () {
      this.$refs.tourTable.refresh(true)
    },
    routineTypeChange () {
      this.$refs.routineTable.refresh(true)
    }
  }
}
</script>
