<template>
    <div>
<!--The template row-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users'}">User list</el-breadcrumb-item>
            <el-breadcrumb-item>User Management</el-breadcrumb-item>
        </el-breadcrumb>
<!--The card box-->
        <el-card class="box-card">
            <el-row :gutter="20" >
                <el-col :span="16" :offset="5">
                        <el-input  placeholder="Please input" v-model="queryInfo.query"  clearable @clear="getUserList" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList" />
                    </el-input>
                </el-col>
                <el-col :span="2" >
                        <el-button type="primary" @click="addDialogVisible = true">Add User</el-button>
                </el-col>
            </el-row>
<!-- The table of contents-->
            <el-table  :data="userList" border class="the"  style="width: 100%">
                <el-table-column align="center" label="No."   type="index"       width="80"/>
                <el-table-column align="center" label="Name"    prop="username"  width="180"/>
                <el-table-column align="center" label="Email"   prop="email"     width="180"/>
                <el-table-column align="center" label="Contact" prop="mobile"    width="180"/>
                <el-table-column align="center" label="Role"    prop="role_name" width="160"/>
                <el-table-column align="center" label="Status"   width="100">
                    <template slot-scope="scope">
                            <el-switch
                                     active-color="#13ce66"
                                     inactive-color="#ff4949"
                                     v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                            </el-switch>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="Settings"  prop=""  width="220">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="Edit user" placement="top-start" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"/>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="delete the user" placement="top-start" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"/>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="set the user role" placement="top-start" :enterable="false" >
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row)"/>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
<!--The pagination of the user list-->
            <el-pagination class="page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="queryInfo.pagenum"
                    :page-sizes="[1,2,3,4,5,6,7]"
                    :page-size=queryInfo.pagesize
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
<!--        The dialog to add the user-->

        <el-dialog title="Add User" :visible.sync="addDialogVisible" @close="closeDialog"  width="50%">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Username" prop="username">
                    <el-input v-model="addForm.username"/>
                </el-form-item>
                <el-form-item label="Password" prop="password" >
                    <el-input v-model="addForm.password" show-password/>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="addForm.email"/>
                </el-form-item>
                <el-form-item label="mobile" prop="mobile">
                    <el-input v-model="addForm.mobile"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible=false">Cancel</el-button>
                <el-button type="primary" @click="addUser">Confirm</el-button>
            </span>
        </el-dialog>
<!--The dialog to change edit the user info-->
        <el-dialog title="Edit User" :visible.sync="editDialogVisible" @close="closeEditDialog"  width="50%">

            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Username" prop="username">
                    <el-input v-model="editForm.username" disabled/>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="editForm.email"/>
                </el-form-item>
                <el-form-item label="mobile" prop="mobile">
                    <el-input v-model="editForm.mobile"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible=false">Cancel</el-button>
                <el-button type="primary" @click="editUser">Confirm</el-button>
            </span>
        </el-dialog>
<!--The user role            -->
        <el-dialog title="User Role" :visible.sync="roleDialogVisible" @close="closeRoleDialog"  width="50%">

            <div>
                <h3>The User is: {{userInfo.username}}</h3>
                <h3>His role is:   {{userInfo.role_name}}</h3>
                <h3>Set a new role:
                    <el-select v-model="selectRoleId" placeholder="Select">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </h3>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible=false">Cancel</el-button>
                <el-button type="primary" @click="changeRole">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default
{
        name: "Users",
        data()
        {
          return {
              queryInfo:
                  {
                      query:'',
                      pagenum:1,// the pagination data
                      pagesize:6
                  },
              userList:[],
              total:0,
              userInfo:{},
              rolesList:[],
              selectRoleId:null,
              addDialogVisible:false,
              editDialogVisible:false,
              roleDialogVisible:false,
              addForm://
                  {
                      username: "",
                      password: "",
                      email: "",
                      mobile: "",
                  },
              editForm://
                  {
                      username: "",
                      email: "",
                      mobile: "",
                  },
              addFormRules:
                  {
                      username:
                      [
                        { required: true, message: 'Please input the username', trigger: 'blur' },
                        { min: 5, max: 10, message: 'Length should be 5 to 10', trigger: 'blur' }
                      ],
                      password:
                          [
                              { required: true, message: 'Please input the password', trigger: 'blur' },
                              { min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur' }
                          ],
                      email:
                          [
                              { required: true, message: 'Please input the email', trigger: 'blur' },
                              { type:'email', message: 'The email is incorrect', trigger: 'blur' }
                          ],
                      mobile:
                          [
                              { required: true, message: 'Please input the mobile phone', trigger: 'blur' },
                              { min:10,max:11, message: 'The phone number is not correct', trigger: 'blur' }
                          ],
                  },
              editFormRules:
                  {// in this part we just change the email and mobile and non to the username and password
                      email:
                          [
                              { required: true, message: 'Please input the email', trigger: 'blur' },
                              { type:'email', message: 'The email is incorrect', trigger: 'blur' }
                          ],
                      mobile:
                          [
                              { required: true, message: 'Please input the mobile phone', trigger: 'blur' },
                              { min:10,max:11, message: 'The phone number is not correct', trigger: 'blur' }
                          ],
                  }
          }
        },
        created()
        {
            this.getUserList()
        },
        methods:
            {
                async getUserList()
                {
                    const {data:res}= await this.$http.get('users',{params:this.queryInfo})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("You have an error to get the user table")
                    }
                    this.userList =res.data.users;
                    this.total=res.data.total;
                },
                //    the pagination
                handleSizeChange(pagesize)
                {
                    this.queryInfo.pagesize=pagesize
                    this.getUserList()
                    console.log(`${pagesize} items per page`);
                },
                handleCurrentChange(pagenum)
                {
                    this.queryInfo.pagenum=pagenum
                    this.getUserList()
                },
                 //Changing the user state
                 async userStateChange(userInfo)
                {
                    const {data:res} =await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                    if(res.meta.status!==200)
                    {
                        userInfo.mg_state =! userInfo.mg_state
                        return this.$message.error("Changing the user state has failed!")
                    }
                    await this.getUserList();
                    this.$message.success('You have successfully changed the state of the user')
                        // this.userList =res.data.mg_state;
                },
                closeDialog()
                {
                    this.$refs.addFormRef.resetFields();
                },
                closeEditDialog()
                {
                    this.$refs.editFormRef.resetFields();
                },
                addUser()
                {
                    this.$refs.addFormRef.validate(async valid=>
                    {
                        if(!valid){return this.$message.error("You have an error to add the user")}

                        const {data:res} = await this.$http.post('users',this.addForm)
                        if(res.meta.status!==201)
                        {
                            return this.$message.error("有错添加用户")
                        }
                        this.$message.success('添加新用户成功了！')
                        this.addDialogVisible=false;
                        await this.getUserList();
                    })
                },
                async showEditDialog(id)
                {
                    const {data:res} = await this.$http.get(`users/${id}`)
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("Showing the edit dialog has failed")
                    }
                    this.editForm = res.data
                    this.editDialogVisible=true
                },
                editUser()
                {
                    this.$refs.editFormRef.validate(async valid=>
                    {
                        if(!valid){return this.$message.error("You have an error to edit the user")}

                        const {data:res} = await this.$http.put(`users/${this.editForm.id}`,
                             {
                                    email: this.editForm.email,
                                    mobile:this.editForm.mobile
                                  })
                        if(res.meta.status!==200)
                        {
                            return this.$message.error("Editing the user has failed Please try again")
                        }
                        this.editDialogVisible=false;
                        await this.getUserList();
                        this.$message.success('You have successfully edited the user info！')
                    })
                },
                deleteUserById(id)
                {
                    this.$confirm('Would you permanently delete this user?', 'Warning',
                        {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        })
                        .then(async () =>
                    {
                        const {data:res} = await this.$http.delete(`users/${id}`)
                        if(res.meta.status!==200)
                        {
                            return this.$message.error("Deleting the user has failed")
                        }
                        this.addDialogVisible=false;
                        await this.getUserList();//get all the users
                        this.$message.success('You have successfuly deleted the user')
                    })
                        .catch(() =>
                    {
                        this.$message({type: 'info', message: 'Delete canceled' });
                    });
                },
                async showRoleDialog(userInfo)
                {
                    this.userInfo = userInfo;
                    const {data:res} = await this.$http.get('roles')
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("You can't get the user role")
                    }
                    this.rolesList = res.data
                    this.roleDialogVisible=true
                },
                async changeRole()
                {
                    if(!this.selectRoleId){return this.$message.error("Please select a role to change")}
                    const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("Changing the user role has failed")
                    }
                    this.$message.success('You have successfuly changed the role of the user')
                    await this.getUserList()
                    this.roleDialogVisible=false
                },
                closeRoleDialog()
                {
                    this.selectRoleId=null
                    this.userInfo={}
                }
            }
    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .el-table-column{text-align:center;justify-items: center;justify-content: center;}
    .the{text-align:center;justify-content: center}
    .page{text-align:center;}
</style>
