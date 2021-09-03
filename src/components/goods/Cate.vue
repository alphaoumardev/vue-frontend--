<template>
    <div>
    <!--The template row-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users'}">User list</el-breadcrumb-item>
            <el-breadcrumb-item>User Management</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row align="center" >
                    <el-button rounded type="primary" @click="showDialog" >Add Role</el-button>
            </el-row>

            <tree-table class="tree-table"  :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border >
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-error" style="color:red" v-if="scope.row.cat_deleted"/>
                    <i class="el-icon-success" style="color:green" v-else/>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">lev 1</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">lev 2</el-tag>
                    <el-tag size="mini" type="danger" v-else>lev 3</el-tag>
                </template>
                <template slot="operate" slot-scope="scope">
                    <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditCate(scope.row.cat_id)">Edit</el-button>
                    <el-button size="mini" type="danger" class="el-icon-delete" @click="removeCate(scope.row.cat_id)">Delete</el-button>
                </template>
            </tree-table>
            <el-pagination class="page"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="queryInfo.pagenum"
                           :page-sizes="[7,10,15]"
                           :page-size="queryInfo.pagesize"
                           background
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="Add Type Form" :visible.sync="addDialogVisible"  @close="closeDialog">

            <el-form :model="addTypeForm" :rules="addTypeFormRules" ref="addTypeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Type Name" prop="cat_name">
                    <el-input v-model="addTypeForm.cat_name"/>
                </el-form-item>
                <el-form-item label="First level">
                    <el-cascader @change="handleChange"  clearable  v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addType">Confirm</el-button>
              </span>
        </el-dialog>
        <el-dialog title="Edit Type Form" :visible.sync="editDialogVisible"  @close="closeEditDialog">

            <el-form :model="editTypeForm" :rules="editTypeFormRules" ref="editTypeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Type Name" prop="cat_name">
                    <el-input v-model="editTypeForm.cat_name"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="editType">Confirm</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default
    {
        name: "Cate",
        data()
        {
            return{
                dialogVisible:false,
                addDialogVisible:false,
                editDialogVisible : false,
                cateList:[],
                total:0,
                parentCateList:[],
                selectedKeys:[],
                cascaderProps:
                    {
                        label:"cat_name",
                        value:"cat_pid",
                        children:"children",
                        expandTrigger:"hover",
                        checkStrictly:true,//having the check box
                    },
                queryInfo:
                    {
                        query:"",
                        type:3,
                        pagenum:1,
                        pagesize:7,
                    },
                columns:
                    [
                        {
                            label:"Type Name",
                            prop:"cat_name",
                            align:"center"
                        },
                        {
                            label:"Available",
                            type:"template",
                            template:"isOk",
                            align:"center"
                        },
                        {
                            label:"Order",
                            type:"template",
                            template:"order",
                            align:"center"
                        },
                        {
                            label:"Operation",
                            type:"template",
                            template:"operate",
                            align:"center"
                        },
                    ],
                addTypeForm:
                    {
                        cat_name:'',
                        cat_pid:0,
                        cat_level:0
                    },
                addTypeFormRules:
                    {
                        cat_name:
                            [
                                { required: true, message: 'Please input the username', trigger: 'blur' },
                            ],
                    },
                editTypeForm:{},
                editTypeFormRules:
                    {
                        cat_name:
                            [
                                { required: true, message: 'Please input the username', trigger: 'blur' },
                            ],
                    },
            }
        },
        created() { this.getCateList() },
        methods:
            {
                async getCateList()
                {
                    const { data: res } = await this.$http.get('categories', {params: this.queryInfo})
                    if (res.meta.status !== 200)
                    {
                        return this.$message.error('You have an error to get the goods type table')
                    }
                    this.cateList = res.data.result
                    this.total = res.data.total
                },
                handleSizeChange(pagesize)
                {
                    this.queryInfo.pagesize=pagesize
                    this.getCateList()
                },
                handleCurrentChange(pagenum)
                {
                    this.queryInfo.pagenum=pagenum
                    this.getCateList()
                },
                async getParentCateList()
                {
                    const { data: res } = await this.$http.get('categories', {params: {type:2}})
                    if (res.meta.status !== 200)
                    {
                        return this.$message.error('Getting the parent node has failed')
                    }
                    this.parentCateList = res.data
                },
                showDialog()
                {
                    this.getParentCateList()
                    this.addDialogVisible=true
                },
                closeDialog()
                {
                    this.$refs.addTypeForm.resetFields()
                    this.selectedKeys=[]
                    this.addTypeForm.cat_level=0
                    this.addTypeForm.cat_pid=0
                },
                handleChange()
                {
                    if(this.selectedKeys.length > 0)
                    {
                        this.addTypeForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
                        this.addTypeForm.cat_level=this.selectedKeys.length
                    }
                    else
                    {
                        this.addTypeForm.cat_pid=0
                        this.addTypeForm.cat_level=0
                    }
                },
                addType()
                {
                    this.$refs.addTypeForm.validate(async valid=>
                    {
                        if(!valid){return this.$message.error("The form is not valid")}
                        const { data: res } = await this.$http.post("categories",this.addTypeForm)
                        if(res.meta.status!==201)
                        {
                            return this.$message.error("Updating categories has failed")
                        }
                        this.$message.success("You successfully updated the good categories ")
                        await this.getCateList()
                        this.addDialogVisible=false
                    })
                },
                async showEditCate(cate)
                {
                    const { data: res } = await this.$http.get(`categories/${cate}`)
                    if(res.meta.status !== 200)
                    {
                        return this.$message.error("You have an error")
                    }
                    this.editTypeForm=res.data//to get the data in to the field
                    this.editDialogVisible=true
                },
                editType()
                {
                    this.$refs.editTypeForm.validate(async valid=>
                    {
                        if(!valid){return this.$message.error("The form is not valid")}
                        const { data: res } = await this.$http.put(`categories/${this.editTypeForm.cat_id}`,{cat_name:this.editTypeForm.cat_name})
                        if(res.meta.status!==200)
                        {
                            return this.$message.error("Updating categories has failed")
                        }
                        this.$message.success("You successfully updated the good categories ")
                        await this.getCateList()
                        this.editDialogVisible=false
                    })
                },
                closeEditDialog()
                {
                    this.$refs.editTypeForm.resetFields()
                },
                removeCate(id)
                {
                    this.$confirm('Would you permanently delete this category ?', 'Warning',
                        {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        })
                        .then(async () =>
                        {
                            const {data:res} = await this.$http.delete(`categories/${id}`)
                            if(res.meta.status!==200)
                            {
                                return this.$message.error("Deleting the role has failed")
                            }
                            this.editDialogVisible=false;
                            await this.getCateList();//get all the users
                            this.$message.success('You have successfuly deleted the role')
                        })
                        .catch(() =>
                        {
                            this.$message({type: 'info', message: 'Delete canceled' });
                        });
                }

            }


    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .el-cascader{width:100%;}
    .tree-table{margin-top:20px;}
</style>
