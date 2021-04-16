<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            <el-button type="primary" @click='dialogFormVisible = true'>添加车辆</el-button>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              width='100%'
              :row-class-name="addRowClass">
             <el-table-column label="票价" prop="price" align="center" header-align="center"></el-table-column>
              <el-table-column label="数量" prop="num" align="center" header-align="center"></el-table-column>
               <el-table-column label="负责人" prop="contacts_name" align="center" header-align="center"></el-table-column>
              <el-table-column label="乘车地点" prop="departurePlace" align="center" header-align="center"></el-table-column>
              <el-table-column label="电话" prop="contacts_phone" align="center" header-align="center"></el-table-column>
              <el-table-column label="车牌" prop="licensePlate" align="center" header-align="center"></el-table-column>
              <el-table-column label="是否完成" :formatter = 'completeFormatter' prop="complete" align="center" header-align="center"></el-table-column>
              <el-table-column label="发车日期" prop="departureTime" align="center" header-align="center"></el-table-column>
              <el-table-column label="操作" header-align="center" align="center" fixed>
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
        <el-form-item label="数量" :label-width="formLabelWidth" prop='num'>
          <el-input-number :min="0" :max="300" label="数量" type = 'num' v-model="form.num"></el-input-number>
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">重置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
   </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from 'src/utils/utils';
  import score from 'src/components/Score/index';
  import uploadFile from 'src/components/common-components/uploadFile';
  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    props: {
      fleetInfo: {
        default: {}
      }
    },
    created () {
      this.fleetId = this.fleetInfo.id;
      this.getTableData();
    },
    data () {
      return {
        dialogTitle: '添加车辆',
        tableData: [],
        loading: false,
        pagesize: 5,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        dialogCity: false,
        form: {
          num: 30,
          departureTime: '2019-10-07 09:00:00',  // 出发时间
          departurePlace: '公众号通知', // 乘车地点
          contacts_phone: '15735801586', // 负责人电话
          contacts_name: '潘政伟', // 负责人姓名
          licensePlate: '', // 车牌
          complete: false // 是否完成
        },
        formRules: {
          name: [
            {required: true, message: '名称必填'}
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
        fleetId: ''
      }
    },
    methods: {
      getTableData () {
        let limit = this.pagesize;
        let skip = (this.currentpage - 1) * limit;
        this.loading = true
        this.$store.dispatch('getCarList', {fleetId: this.fleetId, limit: limit, skip: skip}).then((response) => {
          this.tableData = response.data.list
          this.total = response.data.count
          this.loading = false
        })
      },
      show (scope) {
        console.log(scope);
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.fleetId = this.fleetId  
            this.$store.dispatch('addOrUpdateCar', this.form).then((data) => {
              this.$message({
                message: this.dialogTitle + '成功!',
                type: 'success'
              })
              this.dialogTitle = '添加车辆'
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
          num: 30,
          departureTime: '2019-10-07 09:00:00',  // 出发时间
          departurePlace: '公众号通知', // 乘车地点
          contacts_phone: '15735801586', // 负责人电话
          contacts_name: '潘政伟', // 负责人姓名
          licensePlate: '', // 车牌
          complete: false // 是否完成
        }
        this.dialogFormVisible = false
      },
      handleSelectionChange (val) {
        console.log(val)
      },
      handleDelete (index, row) {
        this.$store.dispatch('removeCar', row).then((response) => {
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
        this.dialogTitle = '更新车队'
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
        this.$store.dispatch('addOrUpdateFleet', {data: cityData}).then((response) => {
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
      uploadFile
    },
    watch: {
      fleetInfo (data) {
        this.fleetId = data.id;  
        this.currentpage = 1;
        this.getTableData()
      }
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
