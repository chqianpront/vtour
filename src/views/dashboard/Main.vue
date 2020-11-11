<template>
  <div>
    <a-row>
      <a-col :span="12">
        <span>
          昨日关键指标
        </span>
      </a-col>
      <a-col :span="12">
        <!-- <div style="text-align: right">
          <span>
            选择日期
            <a-range-picker
              v-model="dateRange"
              :show-time="false"
              format="YYYY-MM-DD"
              @change="coreDateChange"
            />
          </span>
        </div> -->
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card style="width: 100%">
          <p>累计用户数</p>
          <p>{{ coreIndicatorInfo.totalUserNum }}</p>
          <p>昨日新增 {{ coreIndicatorInfo.yesUserNum }}人</p>
          <p>本周新增 {{ coreIndicatorInfo.weekUserNum }}人</p>
          <p>当月新增 {{ coreIndicatorInfo.monthUserNum }}人</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card style="width: 100%">
          <p>绑定总数</p>
          <p>{{ coreIndicatorInfo.totalBoundNum }}</p>
          <p>日绑定数 {{ coreIndicatorInfo.yesBoundNum }}人</p>
          <p>周绑定数 {{ coreIndicatorInfo.weekBoundNum }}人</p>
          <p>月绑定数 {{ coreIndicatorInfo.monthBoundNum }}人</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card style="width: 100%">
          <p>作品发布量</p>
          <p>{{ coreIndicatorInfo.totalTripNum }}</p>
          <p>昨日发布量 {{ coreIndicatorInfo.yesTripNum }}人</p>
          <p>本周发布量 {{ coreIndicatorInfo.weekTripNum }}人</p>
          <p>本月发布量 {{ coreIndicatorInfo.monthTripNum }}人</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card style="width: 100%">
          <p>累计活跃人数</p>
          <p>{{ coreIndicatorInfo.totalActiveUserNum }}</p>
          <p>日活跃数 {{ coreIndicatorInfo.yesActiveUserNum }}人</p>
          <p>周活跃数 {{ coreIndicatorInfo.weekActiveUserNum }}人</p>
          <p>月活跃数 {{ coreIndicatorInfo.monthActiveUserNum }}人</p>
        </a-card>
      </a-col>
    </a-row>
    <a-tabs :default-active-key="1" @change="tabChange">
      <a-tab-pane :key="1" tab="新增人数">
        <a-row>
          <a-col :span="24">
            <a-select :default-value="1" style="width: 120px; margin-right: 14px;" v-model="timeType" :disabled-date="disabledDate" @change="dateChange">
              <a-select-option :value="1">
                昨日
              </a-select-option>
              <a-select-option :value="2">
                本周
              </a-select-option>
              <a-select-option :value="3">
                本月
              </a-select-option>
              <a-select-option :value="4">
                动态时间
              </a-select-option>
            </a-select>
            <a-range-picker v-show="timeType === 4" :value="[startTime, endTime]" :ranges="dOptions" format="YYYY-MM-DD" @change="dateChange"/>
          </a-col>
          <a-col :span="24">
            <ve-line :data="vData1"></ve-line>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="净增绑定">
        <a-row>
          <a-col :span="24">
            <a-select :default-value="1" style="width: 120px; margin-right: 14px;" v-model="timeType" :disabled-date="disabledDate" @change="dateChange">
              <a-select-option :value="1">
                昨日
              </a-select-option>
              <a-select-option :value="2">
                本周
              </a-select-option>
              <a-select-option :value="3">
                本月
              </a-select-option>
              <a-select-option :value="4">
                动态时间
              </a-select-option>
            </a-select>
            <a-range-picker v-show="timeType === 4" :value="[startTime, endTime]" :ranges="dOptions" format="YYYY-MM-DD" @change="dateChange"/>
          </a-col>
          <a-col :span="24">
            <ve-line :data="vData2"></ve-line>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane :key="3" tab="新增作品">
        <a-row>
          <a-col :span="24">
            <a-select :default-value="1" style="width: 120px; margin-right: 14px;" v-model="timeType" :disabled-date="disabledDate" @change="dateChange">
              <a-select-option :value="1">
                昨日
              </a-select-option>
              <a-select-option :value="2">
                本周
              </a-select-option>
              <a-select-option :value="3">
                本月
              </a-select-option>
              <a-select-option :value="4">
                动态时间
              </a-select-option>
            </a-select>
            <a-range-picker v-show="timeType === 4" :value="[startTime, endTime]" :ranges="dOptions" format="YYYY-MM-DD" @change="dateChange"/>
          </a-col>
          <a-col :span="24">
            <ve-line :data="vData3"></ve-line>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane :key="4" tab="活跃人数">
        <a-row>
          <a-col :span="24">
            <a-select :default-value="1" style="width: 120px; margin-right: 14px;" v-model="timeType" :disabled-date="disabledDate" @change="dateChange">
              <a-select-option :value="1">
                昨日
              </a-select-option>
              <a-select-option :value="2">
                本周
              </a-select-option>
              <a-select-option :value="3">
                本月
              </a-select-option>
              <a-select-option :value="4">
                动态时间
              </a-select-option>
            </a-select>
            <a-range-picker v-show="timeType === 4" :value="[startTime, endTime]" :ranges="dOptions" format="YYYY-MM-DD" @change="dateChange"/>
          </a-col>
          <a-col :span="24">
            <ve-line :data="vData4"></ve-line>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import moment from 'moment'
import { coreIndicators, coreIndicatorsChart } from '@/api/manage'
export default {
  data () {
    return {
      dateRange: [],
      coreIndicatorInfo: {},
      vData1: {
        columns: ['dateTime', 'num'],
        rows: []
      },
      vData2: {
        columns: ['dateTime', 'num'],
        rows: []
      },
      vData3: {
        columns: ['dateTime', 'num'],
        rows: []
      },
      vData4: {
        columns: ['dateTime', 'num'],
        rows: []
      },
      startTime: moment().subtract(7, 'days'),
      endTime: moment(),
      timeType: 1,
      queryType: 1,
      dOptions: {}
    }
  },
  mounted () {
    this.getData()
    this.getChartData()
  },
  methods: {
    disabledDate (current) {
      return current && current > moment().endOf('day')
    },
    coreDateChange () {
      console.log('dd')
    },
    dateChange (d) {
      this.startTime = moment(d[0])
      this.endTime = moment(d[1])
      this.getChartData()
    },
    getData () {
      coreIndicators().then(ret => {
        if (ret && ret.value) {
          this.coreIndicatorInfo = ret.value
        }
      })
    },
    tabChange (index) {
      this.queryType = index
      this.getChartData()
    },
    getChartData () {
      const param = {
        queryType: this.queryType,
        timeType: this.timeType
      }
      if (this.timeType === 4) {
        param.startTime = moment(this.startTime).valueOf()
        param.endTime = moment(this.endTime).valueOf()
      }
      coreIndicatorsChart(param).then(ret => {
        if (ret && ret.success) {
          this[`vData${this.queryType}`].rows = ret.value
        }
      })
    }
  }
}
</script>
