<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            <el-button type="primary" @click='dialogFormVisible = true'>添加活动</el-button>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <el-table-column label="活动名称" prop="title" align="center"></el-table-column>
              <el-table-column label="活动图片" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl" alt="活动图片" width="42" height="42" style="border-radius: 50%;">
                </template>
              </el-table-column>
              <el-table-column label="活动类型" prop="type" align="center" header-align="center"></el-table-column>
              <el-table-column label="描述" prop="describe" align="center" header-align="center"></el-table-column>
              <el-table-column label="参与人数" prop="nums" align="center" header-align="center"></el-table-column>
              <el-table-column label="截至时间" prop="date" align="center" header-align="center"></el-table-column>
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
    {{form}}
      <el-form :model="form" ref="ruleForm" :rules="formRules">
        <el-form-item label="活动名称" :label-width="formLabelWidth" prop='title'>
          <el-input v-model="form.title" type = 'title' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="type" :label-width="formLabelWidth">
          <el-radio-group v-model="form.type">
            <el-radio label="type1">输入手机号领取</el-radio>
            <el-radio label="type2">集赞领取</el-radio>
            <el-radio label="type3">支付领取</el-radio>
            <el-radio label="type4">拼团活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="集赞数量" prop="nums" :label-width="formLabelWidth" v-if = "form.type === 'type2'">
          <el-input-number v-model="form.conditions.type2nums" :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="支付价格" prop="nums" :label-width="formLabelWidth" v-if = "form.type === 'type3' || form.type === 'type4'">
          <el-input-number v-model="form.conditions.type3price" :min="0.1" :max="1000" label="描述文字" v-show='form.type === "type3"'></el-input-number>
          <el-input-number v-model="form.conditions.type4price" :min="0.1" :max="1000" label="描述文字" v-show='form.type === "type4"'></el-input-number>
        </el-form-item>
        <el-form-item label="拼团价格" prop="nums" :label-width="formLabelWidth" v-if = "form.type === 'type4'">
          <el-input-number v-model="form.conditions.type4Spellprice" :min="0.1" :max="1000" label="拼团价格"></el-input-number>
        </el-form-item>
        <el-form-item label="参与人数" prop="people" :label-width="formLabelWidth" v-show = "form.type === 'type4'">
          <el-input-number v-model="form.conditions.type4nums" :min="2" :max="1000" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="是否推荐" prop="people" :label-width="formLabelWidth">
          <el-switch
            v-model="form.isRec"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="推荐权重" prop="nums" :label-width="formLabelWidth" v-if = "form.isRec">
          <el-input-number v-model="form.recNums" :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="关联商家" :label-width="formLabelWidth" prop = "merchants">
          <el-select v-model="form.merchants" placeholder="请选择商家" @focus = 'getMerchants'>
            <el-option v-for='item in merchantsList' :label="item.name" :value="item | object2String" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" required :label-width="formLabelWidth">
          <el-col :span="11">
            <el-form-item prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="添加图片" :label-width="formLabelWidth" prop="imgUrl" required

        >
          <uploadFile @uploadSuccess='uploadSuccess' :preView = 'form.imgUrl'></uploadFile>
        </el-form-item>
        <el-form-item label="活动描述" :label-width="formLabelWidth"
        prop='describe'
        >
          <el-input type="textarea" v-model="form.describe" autocomplete="off"></el-input>
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
        dialogTitle: '创建活动',
        tableData: [],
        loading: false,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        form: {
          title: '',
          imgUrl: '',
          describe: '', // 活动描述
          type: '',
          nums: 1, // 活动人数
          conditions: {
            type2nums: 1,
            type3price: 1,
            type4price: 1,
            type4Spellprice: 1,
            type4nums: 2
          }, // 活动条件
          date: '', // 到期时间
          isRec: false,
          recNums: 1, // 活动权重
          merchants: {}
        },
        formRules: {
          title: [
            {required: true, message: '名称必填'}
          ],
          imgUrl: [
            {required: true, message: '必须上传一张图片', trigger: 'change'}
          ],
          describe: [
            {required: true, message: '活动描述必填'}
          ],
          type: [
            {required: true, message: '活动类型必填'}
          ],
          date: [
            {required: true, message: '日期必填'}
          ],
          merchants: [
            {required: true, message: '必须关联一个商家'}
          ]
        },
        formLabelWidth: '120px',
        merchantsList: []
      }
    },
    methods: {
      getTableData () {
        let limit = this.pagesize;
        let skip = (this.currentpage - 1) * limit;
        this.loading = true
        this.$store.dispatch('getActivityList', {limit: limit, skip: skip}).then((response) => {
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
            this.$store.dispatch('addActivity', this.form).then((data) => {
              this.$message({
                message: this.dialogTitle + '成功!',
                type: 'success'
              })
              this.dialogTitle = '活动创建'
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
          title: '',
          imgUrl: '',
          describe: '', // 活动描述
          type: '',
          conditions: {
            nums: 1
          }, // 活动条件
          date: ''
        }
        this.dialogFormVisible = false
      },
      handleSelectionChange (val) {
        console.log(val)
      },
      handleDelete (index, row) {
        this.$store.dispatch('removeActivity', row).then((response) => {
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
        this.dialogTitle = '更新活动'
        this.form = row
      },
      dialogClose () {
        this.resetForm()
      },
      getMerchants () {
        var that = this;
        var skip = 0;
        var limit = 10; 
        this.$store.dispatch('getMerchantsList', {limit: limit, skip: skip}).then((response) => {
          that.merchantsList = response.data.list;
        })
      }
    },
    filters: {
      rateTypeToText (rateType) {
        return rateType === POSITIVE ? '满意' : '不满意';
      },
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      object2String (json) {
        return JSON.stringify(json);
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
    .line {
      text-align: center;
    }
  }
</style>
