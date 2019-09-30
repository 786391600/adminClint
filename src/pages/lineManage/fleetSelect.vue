<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div class="table-wrapper">
            {{lineSelectList}}
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              @row-click = 'fleetSelectClick'
              >
              <el-table-column label="车队名称" prop="name" align="center"></el-table-column>
              <!-- <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                 <el-button
                   size="mini"
                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button
                   size="mini"
                   type="danger"
                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column> -->
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
        <el-form-item label="车队名称" :label-width="formLabelWidth" prop='name'>
          <el-input v-model="form.name" type = 'title' autocomplete="off"></el-input>
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
  export default {
    props: {
      lineSelectList: {
        default: []
      }
    },
    created () {
      this.getTableData();
    },
    data () {
      return {
        dialogTitle: '添加车队',
        tableData: [],
        loading: false,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        dialogCity: false,
        form: {
          name: ''
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
        carDrawer: false,
        fleetInfo: {}
      }
    },
    methods: {
      getTableData () {
        let limit = this.pagesize;
        let skip = (this.currentpage - 1) * limit;
        this.loading = true
        this.$store.dispatch('getFleetList', {limit: limit, skip: skip}).then((response) => {
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
      handleDelete (index, row) {
        this.$store.dispatch('removeFleet', row).then((response) => {
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
      fleetSelectClick (row) {
        if (this.lineSelectList.length <= 0) {
          this.$message({
            message: '请选择要分配的线路',
            type: 'warning'
          })
          return
        }  
        this.$alert('线路将分配到【' + row.name + '】车队', '确认分配', {
          confirmButtonText: '确定',
          callback: action => {
            this.distributionFleet(row.id, this.lineSelectList)
          }
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
      },
      handleAddCar (index, row) {
        this.carDrawer = true
        this.fleetInfo = row
      },
      drawerClose () {
        this.carDrawer = false
      },
      distributionFleet (fleetId, lineList) {
        let query = {fleetId: fleetId, lineList: lineList}  
        this.$store.dispatch('distributionFleet', query).then((data) => {
          if (data.success) {
            this.$message({
              message: '分配成功!',
              type: 'success'
            })
            this.$emit('update', true)
          } else {
            this.$message({
              message: '分配失败!',
              type: 'error'
            }) 
          }
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    components: {}
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
