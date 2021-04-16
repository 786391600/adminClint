<template>
  <div class='basic'>
    <div class="btn">
      <el-button type="primary" @click='fleetAddorUpdateUser'>确定</el-button>
    </div>
    <div class="group">
      <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
        <el-checkbox v-for="user in userList" :label="user.id" :key="user.id">{{user.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      isUpdate: {
        default: false
      },
      fleetInfo: {
        default: {}
      }
    },
    created () {
      this.getUserList();
    },
    data () {
      return {
        userList: [],
        checkedUsers: []
      }
    },
    methods: {
      getUserList () {
        this.$store.dispatch('getMerchantsList', {limit: 100, skip: 0}).then((response) => {
          this.userList = response.data.list
        })
      },
      fleetAddorUpdateUser () {
        let query = {}
        query.fleetId = this.fleetInfo.id
        query.userList = this.checkedUsers
        this.$store.dispatch('fleetAddorUpdateUser', query).then((response) => {
          if (response.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
          }
        })
      }
    },
    filters: {
      
    },
    components: {
      
    },
    watch: {
      isUpdate (data) {
        if (data) {
          this.getUserList()
        } else {
          this.checkedUsers = []
        }
      },
      fleetInfo (data) {
        if (data.userList) {
          this.checkedUsers = data.userList
        }
      }
    }
  };
</script>
<style lang='scss' scope>
  .basic {
    padding: 0 50px 0;
    box-sizing: border-box;
    .group {
      margin-top: 30px;
    }
  }
</style>
