<template>
  <div class="uploadFile">
    <el-upload
      :action="fileUrl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success='imgUploadSuccess'
      :limit='1'
      :before-upload = 'beforeUpload'
      :on-remove='handleRemove'
      :file-list = 'fileList'
      :headers = 'headers'
      name = 'userfile'
      >
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      preView: String
    },
    watch: {
      preView (val) {
        if (val) {
          this.fileList = [{url: val}]
        } else {
          this.fileList = []
        }
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        fileUrl: '/api/upload',
        data: {
          Token: 'rwwXO0wQq5SBEqP7'
        },
        fileList: [],
        headers: {
          'content-type': 'form-data'
        },
        fileServerUrl: 'http://img.beijixiong.club:4869'
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      imgUploadSuccess(response) {
        let res = {};
        if (response.ret) {
          res.url = this.fileServerUrl + '/' + response.info.md5
        }
        this.$emit('uploadSuccess', res)
      },
      beforeUpload(file) {
        var fileName = []
        fileName = file.name.split('.')
        console.log(fileName)
        const extension = fileName[fileName.length - 1] === 'jpg'
        const extension2 = fileName[fileName.length - 1] === 'png'
        file.type = 'jpeg'
        console.log(file)
        const isLt2M = file.size / 1024 < 500
        if (!extension && !extension2) {
          this.$message({
            message: '上传图片只能是jpg、png格式!',
            type: 'warning'
          });
          console.log('上传图片只能是jpg、png格式!')
        }
        // this.headers['Content-Type'] = fileName[fileName.length - 1];
        if (!isLt2M) {
          this.$message({
            message: '上传图片大小不能超过 500kb!',
            type: 'warning'
          })
          console.log('上传图片大小不能超过 500kb!')
        }
        return (extension || extension2) && isLt2M
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
