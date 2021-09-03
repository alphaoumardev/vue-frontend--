<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/rights'}">Right list</el-breadcrumb-item>
            <el-breadcrumb-item>Right Management</el-breadcrumb-item>
        </el-breadcrumb>
        <!--The card box-->
        <el-card class="box-card">
            <el-row :gutter="20" >
                <el-col :span="7" >
                    <el-button type="primary" @click="dialogVisible=true" :span="16" :offset="5">Add Role</el-button>
                </el-col>
                <el-col :span="12" :offset="5">
                    <el-input  placeholder="Please input the role name" v-model="queryList.query" clearable @clear="getRoleList" class="input-with-select" >
                        <el-button slot="append" icon="el-icon-search" type ="danger" @click="getRoleList" />
                    </el-input>
                </el-col>

            </el-row>

            <el-table  :data="rolesList" border stripe>
<!-- expanded row-->
                <el-table-column resizable align="center" type="expand" fixed label="Details" >
                    <template slot-scope="scope" >
                        <div>
                            <el-row v-for="item1 in scope.row.children" :key="item1.id" :class="{borderBottom:true}">
                                <el-col span="6">
                                    <el-tag  closable type="primary" @close="removeRole(scope.row,item1.id)">{{item1.authName}}  </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col span="18">
                                    <el-row  v-for="item2 in item1.children" :key="item2.id">
                                        <el-col span="8">
                                            <el-tag  closable type="success" @close="removeRole(scope.row,item2.id)" >{{item2.authName}} </el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col span="10" >
                                            <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRole(scope.row,item3.id)">{{item3.authName}} </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="No."        type="index"/>
                <el-table-column align="center" label="Role Name" prop="roleName"/>
                <el-table-column align="center" label="Route"      prop="roleDesc" />
                <el-table-column align="center" label="Oprations"     >
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="editButton(scope.row.id)">Edit</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteButton(scope.row.id)">Delete</el-button>
                        <el-button size="mini" icon="el-icon-setting" type="warning" @click="showSetting(scope.row)">Settings</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
<!--To add the a new user role-->
        <el-dialog title="Add new Role" :visible.sync="dialogVisible" @close="closeDialog">
            <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="Role name" prop="RoleName">
                    <el-input v-model="addForm.roleName"/>
                </el-form-item>
                <el-form-item label="Description" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"/>
                </el-form-item>
            </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addRoles">Confirm</el-button>
              </span>
        </el-dialog>
<!-- To edit the role and description       -->
        <el-dialog title="Edit Role" :visible.sync="editdialogVisible"  @close="closeEditDialog">
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="Role name" prop="RoleName">
                    <el-input v-model="editForm.roleName"/>
                </el-form-item>
                <el-form-item label="Description" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editdialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="editRoles">Confirm</el-button>
              </span>
        </el-dialog>
<!-- To set a new role       -->
        <el-dialog title="Set a new Role" :visible.sync="setdialogVisible"  @close="closeSetDialog">
            <el-tree ref="treeRef" :data="rightsList" show-checkbox  node-key="id" default-expand-all
                    :default-checked-keys="defaultsKeys" :props="treeProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="setdialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="setRights">Confirm</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
    export default
    {
        name: "Roles",
        data()
        {
            return {

                queryList:{query:'',},//this is for the search section

                addForm:{roleName:"",roleDesc:"",},
                editForm:{roleName:"",roleDesc:"",},
                rolesList:[],
                rightsList:[],
                defaultsKeys:[],
                roleId:'',
                dialogVisible:false,
                editdialogVisible:false,
                setdialogVisible :false,
                treeProps:
                    {
                        label:"authName",
                        children:"children",
                    },
                addRules:
                    {
                        roleName:
                            [
                                { required: true, message: 'Please input rule name', trigger: 'blur' },
                                // { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
                           ],
                        roleDesc:
                            [
                                { required: true, message: 'Please input rule name', trigger: 'blur' },
                                // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
                            ],
                    },
                editRules:
                    {
                        roleName:
                            [
                                { required: true, message: 'Please input rule name', trigger: 'blur' },
                                // { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
                            ],
                        roleDesc:
                            [
                                { required: true, message: 'Please input rule name', trigger: 'blur' },
                                // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
                            ],
                    }
            }
        },
        created()
        {
            this.getRoleList()
        },
        methods:
            {
                async getRoleList()
                {
                    const {data:res} =await this.$http.get('roles',{params:this.queryList})
                    if(res.meta.status !==200)
                    {
                        return this.$message.error("Getting the user rights list failed")
                    }
                    this.rolesList=res.data
                },
                addRoles()
                {
                    this.$refs.addForm.validate(async valid =>{if(!valid){return this.$message.error("The form vlidation has failed ")}
                        const {data:res} = await this.$http.post('roles',this.addForm)
                        if(res.meta.status !==201)
                        {
                            return this.$message.error("Adding the a new role has failed")
                        }
                        this.dialogVisible=false
                        this.$message.success("You have successfully added a new role")
                        await this.getRoleList()
                    })
                },
                closeDialog()
                {
                    this.$refs.addForm.resetFields()
                },
                closeEditDialog()
                {
                    this.$refs.editForm.resetFields()
                },
                async editButton(id)
                {
                    const {data:res} =await this.$http.get(`roles/${id}`)
                    if(res.meta.status !==200)
                    {
                        return this.$message.error("Getting the user roles  failed")
                    }
                    this.editForm=res.data
                    this.editdialogVisible=true
                },
                editRoles()
                {
                    this.$refs.editForm.validate(async valid=>{if(!valid){return this.$message.error("The form vlidation has failed ")}
                        const {data:res} =await this.$http.put(`roles/${this.editForm.roleId}`,
                            {
                                    roleName:this.editForm.roleName,
                                    roleDesc:this.editForm.roleDesc
                                })
                        if(res.meta.status !==200)
                        {
                            return this.$message.error("Getting the user role failed")
                        }
                        this.editdialogVisible=false
                        this.$message.success("You have successfully added a new role")
                        await this.getRoleList()
                    })
                },
                deleteButton(id)
                {
                    this.$confirm('Would you permanently delete this user?', 'Warning',
                        {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        })
                        .then(async () =>
                        {
                            const {data:res} = await this.$http.delete(`roles/${id}`)
                            if(res.meta.status!==200)
                            {
                                return this.$message.error("Deleting the role has failed")
                            }
                            this.dialogVisible=false;
                            await this.getRoleList();//get all the users
                            this.$message.success('You have successfuly deleted the role')
                        })
                        .catch(() =>
                        {
                            this.$message({type: 'info', message: 'Delete canceled' });
                        });
                },
                removeRole(role,rightsId)
                {
                    this.$confirm('Would you permanently delete the role of this user?', 'Warning',
                        {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        })
                        .then(async () =>
                        {
                            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
                            if(res.meta.status!==200)
                            {
                                return this.$message.error("Deleting the role has failed")
                            }
                            //await this.getRoleList();//不建议这get all the roles of the users
                            role.children=res.data//to get the new role
                            this.$message.success('You have successfuly deleted the roles of the user')
                        })
                        .catch(() =>
                        {
                            this.$message({type: 'info', message: 'Delete canceled' });
                        });
                },


                async showSetting(role)
                {
                    const {data:res} =await this.$http.get(`rights/tree`)
                    if(res.meta.status!==200)
                    {
                        this.$message.error("Getting the roles has failed")
                    }
                    this.rightsList=res.data
                    this.getLeafList(role)
                    this.setdialogVisible=true
                    this.roleId=role.id//to save the row role
                },
                getLeafList(node)
                {
                    if(!node.children)
                    {
                        return this.defaultsKeys.push(node.id)
                    }
                    else node.children.forEach(item => this.getLeafList(item))
                },
                closeSetDialog()
                {
                    // this.defaultsKeys.clear
                    this.defaultsKeys=[]
                },
                async setRights()
                {
                    const keys=this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys())
                    const check=keys.join(",")

                    const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,
                        {
                                rids:check
                            })
                        if(res.meta.status !==200)
                        {
                            return this.$message.error("Changing the right has failed")
                        }
                        this.$message.success("You have successfuly updated the rights of the user")
                        await this.getRoleList()
                        this.setdialogVisible=false
                }

            }

    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .el-table .success-row { background: #f0f9eb;text-align: center; }
    .el-tag{margin:6px;}
    .borderBottom{border: 1px solid #ffecec; margin:5px;}
</style>
