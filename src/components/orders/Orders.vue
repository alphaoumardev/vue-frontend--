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
                <el-col :span="16" :offset="8">
                    <el-input  placeholder="Please input the order name" v-model="queryInfo.query"  clearable @clear="getOrderList" >
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList" />
                    </el-input>
                </el-col>
             </el-row>
<!--The table to display the order list-->
            <el-table :data="orderList" border stripe @expand-change="getOrderDetail">
                <el-table-column label="Details"  type="expand" align="center"  width="100">

                    <template slot-scope="scope">
                        <el-table :data="scope.row.detail" border stripe>
                            <el-table-column align="center" label="Cover" >
                                <template slot-scope="scope">

                                    <el-popover  placement="top-start"  trigger="hover"  >
                                        <img :src="scope.row.url" style="width:500px; height:500px;" />
                                        <img :src="scope.row.url" slot="reference" style="width:70px; height:70px;" />

                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"        label="Product Name" prop="goods_name"/>
                            <el-table-column align="center" width="100px" label="Stock" prop="goods_number"/>
                            <el-table-column align="center" width="100px" label="Weight (kg)" prop="goods_weight"/>
                            <el-table-column align="center" width="100px" label="Price (元)" prop="goods_price"/>
                            <el-table-column align="center" width="120px" label="Total Price (元)" prop="goods_total_price"/>
                        </el-table>
                    </template>

                </el-table-column>
                <el-table-column label="Index"  type="index" align="center" width="80"/>
                <el-table-column label="Order ID" prop=order_number  align="center"/>
                <el-table-column label="Order Price" prop="order_price"  align="center" width="100"/>
                <el-table-column label="Payment"  align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status==='1'" type="success" size="mini"  effect="dark">Paid</el-tag>
                        <el-tag v-else type="danger" size="mini"  effect="dark">Unpaid</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Expedition" prop="is_send"  align="center" width="100"/>
                <el-table-column label="Time" prop="create_time"  align="center"/>
                <el-table-column label="Oprations"   align="center">
                    <template slot-scope="scope" >
                        <el-tooltip  effect="dark" content="Edit the order list" placement="top">
                            <el-button type="primary" class="el-icon-edit" size="mini" @click="openEditDialog(scope.row.order_id)">Edit</el-button>
                        </el-tooltip>
                        <el-tooltip  effect="dark" content="Check the location of the order" placement="top">
                            <el-button type="warning" class="el-icon-location" size="mini" @click="openProgressDialog">Address</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--The pagination of the order list-->
            <el-pagination class="page"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="queryInfo.pagenum"
                           :page-sizes="[5,10,15,20,25,40]"
                           :page-size=queryInfo.pagesize
                           background
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
<!--        The edit dialog for the order-->
        <el-dialog title="Edit the address" :visible.sync="editDialogVisible" @close="closeEditDialog"  width="45%">

            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Address" prop="address1">

                    <el-cascader @change="handleChange" clearable v-model="editForm.address1" :options="citydata" />

                </el-form-item>
                <el-form-item label="Detail" prop="address2">
                    <el-input v-model="editForm.address2" />
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible=false">Cancel</el-button>
                <el-button type="primary" @click="editAddress">Confirm</el-button>
            </span>
        </el-dialog>
<!--       Show the progress of the order-->
        <el-dialog title="Product progress" :visible.sync="progressDialogVisible" width="40%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" icon="el-icon-success"   type="primary" color="green" size="normal" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

    </div>
</template>


<script>
    import citydata from './citydata'
    export default
    {
        name: "Orders",
        data()
        {return{
            orderList:[],
            total:0,
            progressInfo:[],
            editDialogVisible:false,
            progressDialogVisible:false,
            citydata,
            queryInfo:
                {
                    query:'',
                    pagenum:1,// the pagination data
                    pagesize:6
                },
            editForm:
                {
                    address1:[],
                    address2:'',
                },
            progressForm:{},
            editFormRules:
                {
                    address1:[{ required: true, message: 'Please select your province and city', trigger: 'blur' }],
                    address2:[{ required: true, message: 'Please input the address details', trigger: 'blur' }],
                },
            progressFormRules:{},
        }},
        computed:{},
        created(){this.getOrderList()},
        methods:
            {
                async getOrderList()
                {
                    const { data: res } = await this.$http.get('orders',{params:this.queryInfo})
                    if(res.meta.status !==200)
                    {
                        this.$message.error("You have an error to get the order list");
                    }

                    res.data.goods.forEach(item =>
                    {
                        // item.create_time = new Date()
                        item.create_time = this.$utils.formatToTime(item.create_time)

                        item.detail=[]
                    })
                    this.orderList=res.data.goods
                    this.total = res.data.total
                },
                //    the pagination
                handleSizeChange(pagesize)
                {
                    this.queryInfo.pagesize=pagesize
                    this.getOrderList()
                },
                handleCurrentChange(pagenum)
                {
                    this.queryInfo.pagenum=pagenum
                    this.getOrderList()
                },
                async getOrderDetail(row)
                {
                    const {data:res} = await this.$http.get(`orders/${row.order_id}`)
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("Getting the order id has failed")
                    }
                    row.detail=res.data.goods

                    for (const item of row.detail)
                    {
                        const {data:res} = await this.$http.get(`goods/${item.goods_id}`)
                        if(res.meta.status !==200){return this.$message.error("Getting the order id has failed")}

                        this.$set(item,'goods_name',res.data.goods_name)
                        this.$set(item,'goods_weight',res.data.goods_weight)
                        this.$set(item,'url',res.data.pics[0].pics_big_url)
                    }
                    console.log(row.detail)
                    console.log(row)


                },
                openEditDialog(id)
                {
                    this.order_id=id
                    this.editDialogVisible=true
                },
                closeEditDialog()
                {
                    this.$refs.editFormRef.resetFields()
                },
                async editAddress()
                {
                    this.$refs.editFormRef.validate(valid=>{if(!valid) return false})
                    const {data:res} = await this.$http.put(`orders/${this.id}/address`,
                        {
                                consignee_addr:this.editForm.address1.join(' ')+','+this.editForm.address2
                             })
                    this.$message.success("You have successfully updated your address")
                    await this.getOrderList()
                    this.editDialogVisible=false
                },
                handleChange()
                {
                    // if(this.editForm.goods_cat.length!==3 )
                    // {
                    //     this.editForm.goods_cat=[]
                    // }

                },
                async openProgressDialog()
                {
                    const {data:res} = await this.$http.get(`kuaidi/815294206237577`)
                    if(res.meta.status !==200){this.$message.error("Getting the progress of the order has failed"); return false}

                    this.progressInfo=res.data

                    this.progressDialogVisible=true
                },



            }
    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .page{text-align:center;}
    .el-cascader{width:100%;}

</style>
