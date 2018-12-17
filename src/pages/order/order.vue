<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <!--<el-table-column
                type="selection"
                width="55" align='center'>
              </el-table-column>-->
              <el-table-column label="订单号" prop="out_trade_no" align="center"></el-table-column>
              <el-table-column label="发货商品" align="center" prop="body">
              </el-table-column>
              <el-table-column label="商品价格" prop="fee" align="center" header-align="center"></el-table-column>
              <el-table-column label="收货地址" align="left" header-align="center">
                <template slot-scope="scope">
                  <div>
                    <p>姓名：{{scope.row.address.userName}}</p>
                    <p>手机号：{{scope.row.address.telNumber}}</p>
                    <p>邮编：{{scope.row.address.postalCode}}</p>
                    <p>{{scope.row.address.provinceName}}-{{scope.row.address.cityName}}-{{scope.row.address.countyName}}-{{scope.row.address.detailInfo}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="支付状态" align="center" header-align="center">
                <template slot-scope="scope">
                  <div>
                    <span v-if='scope.row.payState' class='pay-success'>支付成功</span><span v-else>未支付</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="送货状态" align="center" header-align="center">
                <template slot-scope="scope">
                  <div>
                    <span v-if='scope.row.deliveryState' class='pay-success'>已发货</span><span v-else>未发货</span>
                  </div>
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
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop='name'>
          <el-input v-model="form.name" type = 'name' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加图片" :label-width="formLabelWidth" prop="imgUrl" required
        >
          <uploadFile @uploadSuccess='uploadSuccess' :preView = 'form.imgUrl'></uploadFile>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth"
        prop='price'
        >
          <el-input type="price" v-model.number="form.price" autocomplete="off"></el-input>
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
    created () {
      this.getTableData();
    },
    data () {
      return {
        dialogTitle: '添加商品',
        tableData: [],
        loading: false,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        form: {
          name: '',
          price: '',
          imgUrl: ''
        },
        formRules: {
          name: [
            {required: true, message: '名称必填'}
          ],
          imgUrl: [
            {required: true, message: '必须上传一张图片', trigger: 'change'}
          ],
          price: [
            {required: true, message: '价格必填'},
            {type: 'number', message: '价格必须为数字值'}
          ]
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      getTableData () {
        let limit = this.pagesize;
        let skip = (this.currentpage - 1) * limit;
        this.loading = true
        this.$store.dispatch('getOrderList', {limit: limit, skip: skip}).then((response) => {
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
        this.form.imgUrl = response.url
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('addCommodity', this.form).then((data) => {
              this.$message({
                message: this.dialogTitle + '成功!',
                type: 'success'
              })
              this.dialogTitle = '商品添加'
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
          name: '',
          price: '',
          imgUrl: ''
        }
        this.dialogFormVisible = false
      },
      handleSelectionChange (val) {
        console.log(val)
      },
      handleDelete (index, row) {
        this.$store.dispatch('removeCommodity', row).then((response) => {
          this.$message({
            message: '商品删除成功!',
            type: 'success'
          })
          this.currentpage = 1
          this.getTableData()
        })
      },
      handleEdit (index, row) {
        this.dialogFormVisible = true
        this.dialogTitle = '更新商品'
        this.form = row
      },
      dialogClose () {
        this.resetForm()
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
    .pay-success{
      color:red;
    }
  }
</style>
