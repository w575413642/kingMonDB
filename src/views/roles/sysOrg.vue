<template>
  <div class="app-container">
    <div class="filter-container">
      <el-dialog v-el-drag-dialog title="新增模块" :visible.sync="dialogTableVisible">
        <el-form ref="form" :model="form" label-width="100px" style="width: 90%;margin: auto;">
          <!-- <el-form-item label="所属appKey">
            <el-select v-model="form.appKey" clearable style="width:200px;" placeholder="选择App类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="节点名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="节点状态">
            <el-switch v-model="form.status"></el-switch>
          </el-form-item>
          <el-form-item label="节点码">
            <el-input type="textarea" v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="test">立即创建</el-button>
            <el-button @click="dialogTableVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- @node-click="moreTrees" -->
      <label style="margin-right: 12px;font-weight: 100;">输入查找节点</label>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 12px; width: 350px;">
        <el-button type="primary" @click="searchsDom">点击搜索</el-button>
      </el-input>
      <el-tree ref="trees" default-expand-all :filter-node-method="filterNode" :data="tableData" :load="loadNode" lazy show-checkbox>
        <span style="height: 40px;" class="custom-tree-node" slot-scope="{ node, data }">
          <span style="line-height: 40px;">{{ node.label }}</span>
          <span>
            <el-button size="mini" type="text" style="margin-left: 12px;" @click="() => append(data)">
              增加
            </el-button>
            <el-button type="text" size="mini" @click="() => deletDom(data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
      <!-- <el-input size="small" class="kingMon-right" v-model="searchs.name" style="width: 200px;height: 35px;" placeholder="输入AppKey查询"></el-input> -->
      <!-- <el-select class="kingMon-right" v-model="searchFrom.rules" clearable style="width: 90px" placeholder="选择顺序">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="kingMon-right" v-model="searchFrom.rules" clearable style="width: 120px" placeholder="选择类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <!-- <el-button class="kingMon-right" type="primary" icon="el-icon-search" @click="searchApp">搜索</el-button> -->
      <!-- 左侧选择最高权限 -->

      <!-- 图表操作 -->
      <el-checkbox-group v-model="checkboxVal">
        <!-- <el-checkbox label="apple">apple</el-checkbox>
        <el-checkbox label="banana">banana</el-checkbox>
        <el-checkbox label="orange">orange</el-checkbox> -->
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  const defaultFormThead = ["appKey", "status", "remark"];
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: "sysOrg",
    directives: {
      elDragDialog
    },
    data() {
      return {
        // 节点查询
        filterText: "",
        // 代理节点
        testss: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeNow: [-1],
        // 动态子集
        childrens: [],
        nowApps: "",
        // 分页改动
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        // 查询
        searchs: {},
        // 新增用戶
        form: {
          status: true
        },
        dialogTableVisible: false,
        // 顺序
        options: [],
        // 搜索内容集合
        searchFrom: {},
        // 是否loading
        listLoading: false,
        // 表格集合
        tableData: [],
        key: 1, // table key
        checkboxVal: defaultFormThead, // checkboxVal
        formThead: defaultFormThead // 默认表头 Default header
      };
    },
    created() {
      this.upApp()
    },

    methods: {
      searchsDom (){

      },
      // 节点内查找
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 删除节点
      deletDom(data) {

        this.$confirm('此操作将永久删除' + data.label + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteSysOrg', {
            id: data.id
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.upApp()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      append(data) {
        this.dialogTableVisible = true;
        this.testss = data
      },
      test() {
        this.$store.dispatch('createSysOrg', {
          status: (this.form.status ? 1 : 0),
          name: this.form.name,
          code: this.form.code,
          parentId: this.testss.id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '增加成功!'
          });
          this.dialogTableVisible = false;
          this.upApp()
        }).catch(() => {})
      },
      // 循环加载节点
      loadNode(node, resolve) {
        console.log(node)
        this.$store.dispatch('loadMorex', {
          id: (node.data.length == 0 ? 1 : node.data.id),
        }).then(() => {
          // this.addDataLists(val)
          let nodes = this.$store.state.sysOrg.Nows.map(row => {
            return {
              id: row.id,
              label: row.name,
              parentId: row.parentId
            }
          })
          this.listLoading = false
          if (node.level === 0) {
            return resolve();
          } else {
            return resolve(nodes);
          }
        }).catch(() => {})
      },
      // 下级查询
      moreTrees(val) {
        return
        console.log(val)
        this.listLoading = true;
        this.$store.dispatch('loadMore', {
          id: val.id,
        }).then(() => {
          // this.addDataLists(val)
          val.children = this.$store.state.sysOrg.Nows.map(row => {
            return {
              id: row.id,
              label: row.name,
              parentId: row.parentId
            }
          })
          console.log(val, this.tableData)
          this.listLoading = false
        }).catch(() => {})
      },
      // 点击增加
      addDataLists(data) {
        data.children = this.$store.state.sysOrg.Nows.map(row => {
          return {
            id: row.id,
            label: row.name,
            parentId: row.parentId
          }
        })
        this.tableData = this.tableData.map(rows => {
          if (rows.id == this.childrens[0].parentId) {
            let btc = this.childrens
            return {
              id: rows.id,
              label: rows.label,
              children: [...btc]
            }
          }
        })

        let btc = this.childrens

        // this.tableData = this.tableData.map(rows => {
        //   console.log(rows.id)
        //   if(rows.id == this.childrens[0].parentId){
        //     return {
        //       id: rows.id,
        //       label :rows.label,
        //       children: [...btc]
        //     }
        //   }
        // })
        console.log(this.tableData)
      },
      // 查询所有权限
      upApp() {
        this.listLoading = true;
        this.$store.dispatch('loadChildSysOrg', {
          id: -1,
        }).then(() => {
          this.updataLists()
          this.listLoading = false
        }).catch(() => {})
      },
      // 分页改动
      handleCurrentChange() {

      },
      handleSizeChange() {

      },
      // 查询
      searchApp() {
        this.$store.dispatch('loadAuthRoleList', this.searchs).then(() => {
          this.$message({
            type: 'success',
            message: '查询完成!'
          });
          this.updataLists()
        }).catch(error => {
          this.$message({
            type: 'warning',
            message: '查询失败!'
          });
        })
      },
      // 添加
      addStatic() {
        this.$store.dispatch('addRole', {
          status: (this.form.status == true ? 1 : 2),
          appKey: this.form.appKey,
          name: this.form.name,
          roleCode: this.form.roleCode,
          description: this.form.description
        }).then(() => {
          this.$message({
            message: this.form.name + ' - 添加成功',
            type: 'success'
          })
          this.searchFrom.rules = this.form.appKey
          this.upApp()
          this.form = {
            status: true
          }
          this.dialogTableVisible = false;
          this.pullData()
        })
      },
      // 删除
      confirmDel(row) {
        this.$confirm('此操作将永久删除用户：' + row.name + ' , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deletAuthRole', {
            id: row.id
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.upApp()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 取消修改
      cancelEdit(row) {
        row.title = row.originalTitle
        row.edit = false
      },
      // 修改
      confirmEdit(row) {
        // 编辑App内容
        this.$store.dispatch('updateRole', {
          id: row.id,
          status: (row.switch ? 1 : 2),
          appKey: row.appKey,
          roleCode: row.roleCode,
          name: row.name,
          description: row.description
        }).then(() => {
          // 编辑完成后关闭选项卡并提示
          row.edit = false
          row.originalTitle = row.title
          this.$message({
            message: row.appKey + '修改成功',
            type: 'success'
          })
          this.upApp()
        }).catch(() => {
          alert("error")
        })

      },
      // 循环更新列表
      updataLists() {
        this.tableData = this.$store.state.sysOrg.Org.map(row => {
          return {
            id: row.id,
            label: row.name
          }
        })
        console.log(this.tableData, "当前Table-----------------------")
      },
      // 查询
      pullData() {

      }
    },
    watch: {
      filterText(val) {
        this.$refs.trees.filter(val);
      },
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(
          i => valArr.indexOf(i) >= 0
        );
        this.key = this.key + 1;
      }
    }
  };

</script>
<style scoped lang="scss">
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .kingMon-right {
    margin-right: 8px;
  }

  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3;
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3;
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

</style>
