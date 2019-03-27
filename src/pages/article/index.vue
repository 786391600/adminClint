<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header" v-show="isSelect">
            <el-button type="primary" @click='dialogFormVisible = true'>添加文章</el-button>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass"
              @row-click="openDetails" 
              >
              <!--<el-table-column
                type="selection"
                width="55" align='center'>
              </el-table-column>-->
              <el-table-column label="文章名称" prop="name" align="center"></el-table-column>
              <el-table-column label="文章代码" align="center" prop="code" :show-overflow-tooltip="true">
                
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" v-if="isSelect">
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
        <el-form-item label="文章名称" :label-width="formLabelWidth" prop='name'>
          <el-input v-model="form.name" type = 'name' autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加代码"  :label-width="formLabelWidth" prop="code" required>
          <el-input v-model="form.code" type = 'textarea' autocomplete="off"></el-input>
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
  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    props: {
      isSelect: {
        type: Boolean,
        default: true
      }
    },
    created () {
      this.getTableData();
    },
    data () {
      return {
        dialogTitle: '添加文章',
        tableData: [],
        loading: false,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        dialogFormVisible: false,
        form: {
          name: '',
          code: ''
        },
        formRules: {
          name: [
            {required: true, message: '名称必填'}
          ],
          code: [
            {required: true, message: '必须编辑代码', trigger: 'change'}
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
        this.$store.dispatch('getArticleList', {limit: limit, skip: skip}).then((response) => {
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
            this.$store.dispatch('addArticle', this.form).then((data) => {
              this.$message({
                message: this.dialogTitle + '成功!',
                type: 'success'
              })
              this.dialogTitle = '文章添加'
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
          code: ''
        }
        this.dialogFormVisible = false
      },
      handleSelectionChange (val) {
        console.log(val)
      },
      handleDelete (index, row) {
        this.$store.dispatch('removeCommodity', row).then((response) => {
          this.$message({
            message: '文章删除成功!',
            type: 'success'
          })
          this.currentpage = 1
          this.getTableData()
        })
      },
      handleEdit (index, row) {
        this.dialogFormVisible = true
        this.dialogTitle = '更新文章'
        this.form = row
      },
      dialogClose () {
        this.resetForm()
      },
      openDetails (row) {
        this.$emit('selectClick', row)
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
      score
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
  }
</style>
