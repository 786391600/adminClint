<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            <el-button type="primary" @click='dialogFormVisible = true'>添加线路</el-button>
            <el-button type="primary" @click='dialogCity = true'>城市管理</el-button>
            <el-button type="primary" @click='updateFleet = true'>分配车队</el-button>
            <el-popover
              placement="right"
              width="400"
              @hide = 'searchPoverHide'
              trigger="click">
               <el-form ref="form" :model="queryCriteria" label-width="80px">
                  <el-form-item label="起点">
                    <el-input v-model="queryCriteria.start"></el-input>
                  </el-form-item>
                  <el-form-item label="终点">
                    <el-input v-model="queryCriteria.end"></el-input>
                  </el-form-item>
                  <el-form-item label="是否停用">
                    <el-switch v-model="queryCriteria.isStop">
                    </el-switch>
                  </el-form-item>
                </el-form>
              <el-button type='primary' slot="reference">查询条件</el-button>
            </el-popover>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              @selection-change="handleSelectionChange"
              :row-class-name="addRowClass">
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column label="起点" prop="start" align="center"></el-table-column>
              <el-table-column label="终点" prop="end" align="center" header-align="center"></el-table-column>
              <el-table-column label="票价" prop="price" align="center" header-align="center"></el-table-column>
              <el-table-column label="是否停用" prop="isStop" align="center" header-align="center">
                <template slot-scope="scope">
                  <span v-if='scope.row.isStop' style="color: red">已停用</span><span v-else>在运营</span>
                </template>
              </el-table-column>
               <el-table-column label="所属车队" align="center" header-align="center">
                <template slot-scope="scope">
                  {{scope.row.fleet_info[0] ? scope.row.fleet_info[0].name : '未分配'}}
                </template>
               </el-table-column>
              <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                 <el-button
                   size="mini"
                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button
                   size="mini"
                   type="danger"
                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 16px; text-align:right;"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 15, 20]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true" @close = 'dialogClose'>
      <el-form :model="form" ref="ruleForm" :rules="formRules">
        <el-form-item label="起点" :label-width="formLabelWidth" prop='start'>
          <el-input v-model="form.start" type = 'title' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="终点" prop="end" :label-width="formLabelWidth">
          <el-input v-model="form.end" type = 'end' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="票价" :label-width="formLabelWidth" prop='price'>
          <el-input-number :min="0" :max="300" label="票价" type='price' v-model="form.price"></el-input-number>
        </el-form-item>
        <el-form-item label="发车日期" required :label-width="formLabelWidth">
          <el-col :span="11">
            <el-form-item prop="departureTime">
              <el-date-picker type="datetime" placeholder="选择日期" v-model="form.departureTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="发车地点" prop="departurePlace" :label-width="formLabelWidth">
          <el-input v-model="form.departurePlace" type = 'departurePlace' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名"  :label-width="formLabelWidth">
          <el-input v-model="form.contacts_name" type = 'contacts_name' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机"  :label-width="formLabelWidth">
          <el-input v-model="form.contacts_phone" type = 'contacts_phone' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌"  :label-width="formLabelWidth">
          <el-input v-model="form.licensePlate" type = 'licensePlate' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否完成" :label-width="formLabelWidth">
          <el-switch v-model="form.complete"></el-switch>
        </el-form-item>
         <el-form-item label="是否停用" :label-width="formLabelWidth">
          <el-switch v-model="form.isStop"></el-switch>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">重置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
   </el-dialog>
  <el-dialog :title="'城市管理'" :visible.sync="dialogCity" :append-to-body="true" @close = 'dialogCityClose'>
    <div class="cityBox">
      <el-input type='textarea' v-model="cityText"></el-input>
    </div>
    <div>
      <p>城市参考</p>
      <p>[
    {
        "title": "推荐线路",
        "type": "hot",
        "item": [
            {
                "name": "吕梁学院",
                "key": "热门",
                "test": "testValue"
            },
            {
                "name": "乡宁",
                "key": "热门",
                "test": "testValue"
            }
        ]
    },
    {
        "title": "C",
        "item": [
            {
                "name": "长治医学院",
                "key": "C"
            },
            {
                "name": "长治学院",
                "key": "C"
            }
        ]
    },
    {
        "title": "T",
        "item": [
            {
                "name": "太原师范学院",
                "key": "T"
            },
            {
                "name": "太原理工大学",
                "key": "T"
            }
        ]
    },
    {
        "title": "S",
        "item": [
            {
                "name": "山西交通职业技术学院",
                "key": "S"
            },
            {
                "name": "山西建筑职业技术学院",
                "key": "S"
            },
            {
                "name": "山西传媒学院",
                "key": "S"
            },
            {
                "name": "山西中医药大学",
                "key": "S"
            },
            {
                "name": "山西卫生健康职业学院",
                "key": "S"
            },
            {
                "name": "山西能源学院",
                "key": "S"
            },
            {
                "name": "山西医科大学",
                "key": "S"
            }
        ]
    },
    {
        "title": "J",
        "item": [
            {
                "name": "吉县",
                "key": "J"
            },
            {
                "name": "晋中学院",
                "key": "J"
            },
            {
                "name": "晋中师范",
                "key": "J"
            },
            {
                "name": "晋中职业技术学院",
                "key": "J"
            }
        ]
    },
    {
        "title": "X",
        "item": [
            {
                "name": "乡宁",
                "key": "X"
            }
        ]
    }
]</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sendCity">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :title="'订单管理'" :visible.sync="dialogOrderList" :append-to-body="true" @close = 'dialogClose'>
    <orderList></orderList>
   </el-dialog>
   <el-dialog :title="'车队选择'" :visible.sync="updateFleet" :append-to-body="true" @close = 'dialogClose'>
    <fleetSelect :lineSelectList = 'lineSelectList' @update = 'fleetUpdate'></fleetSelect>
   </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from 'src/utils/utils';
  import score from 'src/components/Score/index';
  import uploadFile from 'src/components/common-components/uploadFile';
  import orderList from './orderList'
  import fleetSelect from './fleetSelect'
  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    created () {
      this.getTableData();
    },
    data () {
      return {
        dialogTitle: '添加线路',
        tableData: [],
        loading: false,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        dialogCity: false,
        updateFleet: false,
        form: {
          start: '吉县',
          end: '',
          price: 105,
          departureTime: '2019-08-24 08:50:00',  // 出发时间
          departurePlace: '', // 乘车地点
          contacts_phone: '15735801586', // 负责人电话
          contacts_name: '潘政伟', // 负责人姓名
          licensePlate: '', // 车牌
          complete: false, // 是否完成
          isStop: false // 是否停用
        },
        formRules: {
          start: [
            {required: true, message: '起点必填'}
          ],
          end: [
            {required: true, message: '终点必填'}
          ],
          price: [
            {required: true, message: '价格必填'}
          ],
          num: [
            {required: true, message: '数量必填'}
          ],
          departureTime: [
            {required: true, message: '日期必填'}
          ]
        },
        formLabelWidth: '120px',
        cityText: '',
        dialogOrderList: false,
        lineSelectList: [],
        queryCriteria: {
          start: '',
          end: '',
          isStop: false
        }
      }
    },
    methods: {
      getTableData () {
        let query = this.getSearchQuery()
        let limit = this.pagesize;
        let skip = (this.currentpage - 1) * limit;
        this.loading = true
        this.$store.dispatch('getLineManageList', {limit: limit, skip: skip, query: query}).then((response) => {
          this.tableData = response.data.list
          this.total = response.data.count
          this.loading = false
        })
      },
      getSearchQuery () {
        let query = {}
        for (var k in this.queryCriteria) {
          if (this.queryCriteria[k] || k === 'isStop') {
            query[k] = this.queryCriteria[k]
          }
        }
        return query
      },
      handleSizeChange (value) {
        this.pagesize = value;
        this.getTableData();
      },
      handleCurrentChange (value) {
        this.currentpage = value;
        this.getTableData();
      },
      addRowClass ({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
      },
      uploadSuccess (response) {
        this.form.imgUrl = response.url;
      },
      submitForm (formName) {
        console.log(this.form)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('addLineManage', this.form).then((data) => {
              this.$message({
                message: this.dialogTitle + '成功!',
                type: 'success'
              })
              this.dialogTitle = '线路创建'
              this.resetForm('ruleForm')
              this.getTableData()
            })
          } else {
            return false;
          }
        })
      },
      resetForm() {
        this.form = {
          start: '吉县',
          end: '',
          price: 105,
          departureTime: '2019-08-24 08:50:00',
          departurePlace: '',
          contacts_phone: '15735801586', // 负责人电话
          contacts_name: '潘政伟', // 负责人姓名
          licensePlate: '', // 车牌
          complete: false
        }
        this.dialogFormVisible = false
      },
      handleSelectionChange (val) {
        let newArr = []
        val.forEach(element => {
          newArr.push(element.id)
        })
        this.lineSelectList = newArr
      },
      handleDelete (index, row) {
        this.$store.dispatch('removeLine', row).then((response) => {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.currentpage = 1
          this.getTableData()
        })
      },
      handleEdit (index, row) {
        this.dialogFormVisible = true
        this.dialogTitle = '更新线路'
        this.form = row
      },
      handleSmsNotice (index, row) {
        this.$store.dispatch('smsNotice', row).then((response) => {
          this.$message({
            message: '发送成功!',
            type: 'success'
          })
        })
      },
      dialogClose () {
        this.resetForm()
      },
      dialogCityClose () {
        this.dialogCity = false
      },
      sendCity () {
        let cityText = this.cityText.replace(/\s+/g, '')
        let cityData = JSON.parse(cityText)
        this.$store.dispatch('addOrUpdateCity', {data: cityData}).then((response) => {
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          this.dialogCity = false
        })
      },
      handleShowOrderList (index, row) {
        this.dialogOrderList = true
      },
      completeFormatter(row, column) {
        return row.complete ? '完成' : '未完成'
      },
      fleetUpdate () {
        this.getTableData()
      },
      searchPoverHide () {
        let query = this.getSearchQuery()
        if (query) {
          this.currentpage = 1
          this.getTableData()
        }
      }
    },
    filters: {
      rateTypeToText (rateType) {
        return rateType === POSITIVE ? '满意' : '不满意';
      },
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    components: {
      score,
      uploadFile,
      orderList,
      fleetSelect
    }
  };
</script>
<style lang='scss'>
  .basic {
    .el-table {
      .warning-row {
        background-color: oldlace;
      }
    }
    .recommend-tag {
      display: inline-block;
      margin: 4px 0;
      margin-right: 4px;
      &:last-child {
        margin-right: 0;
      }
    }
    .line {
      text-align: center;
    }
  }
</style>
