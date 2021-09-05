<template>
    <div>
            <!--The template row-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/users'}">User list</el-breadcrumb-item>
                <el-breadcrumb-item>Parameters</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card">
                <el-alert  title="You have a warning message" type="warning" show-icon :closable="false"/>

                <el-row class="select">
                    <span>Select the product </span>
                    <el-cascader @change="handleChange"  clearable  v-model="selectedKeys" :options="cateList" :props="cascaderProps"/>
                </el-row>
        <!-- tabs           -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Active Name"   name="many">
                        <el-button :desabled="btnDesabled" type="primary" @click="openAddDialog">Add a name</el-button>
                        <el-table :data="paramsData" border stripe>
                            <el-table-column label="Details" align="center" width="100px" type="expand">
                                <template slot-scope="scope">
            <!-- The tag   details       -->
                                    <el-tag closable :key="tag" v-for="(item,tag) in scope.row.attr_vals"  @close="handleCloseTag(scope.row,tag)"> {{item}}  </el-tag>
                                    <el-input class="tag-input" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"/>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInputTag(scope.row)">New Tag</el-button>

                                </template>
                            </el-table-column>
                            <el-table-column label="No." type="index" align="center"  />
                            <el-table-column label="Name" align="center" prop="attr_name" />
                            <el-table-column label="Oprations" align="center"   >
                                <template slot-scope="scope">
                                    <el-button type="primary" class="el-icon-edit" @close="closeEditDialog" @click="openEditDialog(scope.row.attr_id)">Edit</el-button>
                                    <el-button type="danger" class="el-icon-delete"  @click="deleteRow(scope.row.attr_id)">Delete</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="Others"  name="only">
                        <el-button :desabled="btnDesabled" type="primary"  @click="openAddDialog" >Add a name</el-button>
                        <el-table :data="paramsData" border stripe>
                            <el-table-column label="Details" align="center" width="100px" type="expand">
                                <template slot-scope="scope">
                                    <!-- The tag   details       -->
                                    <el-tag closable :key="tag" v-for="(item,tag) in scope.row.attr_vals"  @close="handleCloseTag(scope.row,tag)"> {{item}}  </el-tag>
                                    <el-input class="tag-input" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"/>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInputTag(scope.row)">New Tag</el-button>

                                </template>
                            </el-table-column>
                            <el-table-column label="No." type="index" align="center"  />
                            <el-table-column label="Name" align="center" prop="attr_name" />
                            <el-table-column label="Oprations" align="center"   >
                                <template slot-scope="scope">
                                    <el-button type="primary" class="el-icon-edit" @click="openEditDialog(scope.row.attr_id)">Edit</el-button>
                                    <el-button type="danger" class="el-icon-delete" @click="deleteRow(scope.row.attr_id)">Delete</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                </el-tabs>
            </el-card>
<!--The dialog to add a name-->
        <el-dialog :title="the_title" @close="closeDialog" :visible.sync="dialogVisible" width="50%">
            <el-form :model="ruleForm" :rules="addRules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm">
                <el-form-item label="Activity name" prop="attr_name">
                    <el-input v-model="ruleForm.attr_name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addName">Confirm</el-button>
            </span>
        </el-dialog>
<!--The dialog to edit the name-->
        <el-dialog :title="the_title" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editRuleForm" :rules="ruleForm_edit" ref="editRuleFormRef" label-width="110px">
                <el-form-item label="Activity name" prop="attr_name">
                    <el-input v-model="editRuleForm.attr_name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editName">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default
    {
        name: "Params",
        data()
        {
            return{
                cateList:[],
                selectedKeys:[],
                activeName:'many',
                paramsData: [],
                dialogVisible:false,
                editDialogVisible:false,
                ruleForm:{},
                editRuleForm:{},

                inputVisible:false,
                inputValue:false,


                addRules:
                    {
                        attr_name:
                        [
                            { required: true, message: 'Please input Activity name', trigger: 'blur' },
                            { min: 5, max: 10, message: 'Length should be 5 to 10', trigger: 'blur' }
                        ],
                    },
                ruleForm_edit:
                    {
                        attr_name:
                            [
                                { required: true, message: 'Please input Activity name', trigger: 'blur' },
                                { min: 5, max: 10, message: 'Length should be 5 to 10', trigger: 'blur' }
                            ],
                    },
                cascaderProps:
                    {
                        label:"cat_name",
                        value:"cat_id",
                        children:"children",
                        expandTrigger:"hover",
                        checkStrictly:false,//having the check box
                    },
            }
        },
        created()
        {
            this.getCateList()
        },
        computed:
            {
                cateId()
                {
                    return this.selectedKeys.length ===3 ? this.selectedKeys[2]:null
                },
                btnDesabled()
                {
                    return this.selectedKeys.length !== 3
                },
                the_title()
                {
                    return this.activeName==="many"? "Add an Active name":"Add Others Name"
                },
            },
        methods:
            {
                async getCateList()
                {
                    const { data: res } = await this.$http.get('categories')
                    if (res.meta.status !== 200)
                    {
                        return this.$message.error('You have an error to get the goods type table')
                    }
                    this.cateList = res.data
                },
                handleChange()
                {
                    this.getParamsData()
                },
                async getParamsData()
                {
                    if(this.selectedKeys.length !==3)
                    {
                        this.selectedKeys=[]
                        this.paramsData =[]
                    }
                    const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel:this.activeName}})
                    if (res.meta.status !== 200)
                    {
                        return this.$message.error('You have an error to get the variables')
                    }
                    res.data.forEach(item =>
                    {
                        item.attr_vals=item.attr_vals ? item.attr_vals.split(' '):[]
                        item.inputVisible=false//this is to just open the input field in one row instead of more
                        item.inputValue=''
                    })
                    this.paramsData = res.data
                },
                handleClick()
                {
                    this.getParamsData()
                },
                openAddDialog()
                {
                    this.dialogVisible=true
                },
                addName()
                {
                    this.$refs.ruleFormRef.validate( async valid=>
                    {
                        if(!valid){return false}
                        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
                            {
                                    attr_name:this.ruleForm.attr_name,
                                    attr_sel:this.activeName
                                })
                        if (res.meta.status !== 201)
                        {
                            return this.$message.error('You have an error to add an active name')
                        }
                        this.$message.success("You have successfully added an active name")
                        await this.getParamsData()
                        this.dialogVisible=false
                    })
                },
                closeDialog()
                {
                    this.dialogVisible=false
                    this.ruleForm=[]

                },

                async openEditDialog(id)
                {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
                    if(res.meta.status!==200){return this.$message.error("Getting the data has failes")}
                    this.editDialogVisible=true
                    this.editRuleForm=res.data
                },
                closeEditDialog()
                {
                    this.$refs.editRuleFormRef.resetFields()
                },
                editName()
                {
                    this.$refs.editRuleFormRef.validate( async valid=>
                    {
                        if(!valid){return false}
                        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editRuleForm.attr_id}`,
                            {
                                    attr_name:this.editRuleForm.attr_name,
                                    attr_sel:this.activeName,
                                    attr_vals:this.editRuleForm.attr_vals,
                                })
                        if (res.meta.status !== 200)
                        {
                            return this.$message.error('You have an error to update the active name')
                        }
                        this.$message.success("You have successfully updated the active name")
                        await this.getParamsData()
                        this.editDialogVisible=false
                    })
                },
                deleteRow(id)
                {
                this.$confirm('Would you permanently delete this Name?', 'Warning',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    })
                    .then(async () =>
                    {
                        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                        if(res.meta.status!==200)
                        {
                            return this.$message.error("Deleting the role has failed")
                        }
                        this.editDialogVisible=false;
                        await this.getParamsData();//get all the users
                        this.$message.success('You have successfuly deleted the name')
                    })
                    .catch(() =>
                    {
                        this.$message({type: 'info', message: 'Delete canceled' });
                    });
                },
                handleCloseTag(row,tag)
                {
                    row.attr_vals.splice(tag,1);
                },
                showInputTag(row)
                {
                    row.inputVisible=true
                    this.$nextTick(() =>{this.$refs.saveTagInput.input.focus()})
                },
                handleInputConfirm(row)
                {
                    if(row.inputValue.trim())
                    {
                        row.attr_vals.push(row.inputValue.trim())
                        this.updateParamsDetails(row)
                    }
                    row.inputVisible=false
                    row.inputValue=''
                },
                async updateParamsDetails(row)
                {
                    const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                        {
                                attr_name:row.attr_name,
                                attr_sel:row.activeName,
                                attr_vals:row.attr_vals.join(" "),
                            })
                    if (res.meta.status !==200)
                    {
                        return this.$message.error("Updating the value has failed")
                    }
                    this.$message.success("You have updated the value")
                }








            },

    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .el-alert{text-align:center;}
    .select{margin-top:10px;}
    .el-tag{margin:10px;}
    .tag-input{width:150px;}
</style>
