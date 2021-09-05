<template>
    <div>
        <!--The template row-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users'}">User list</el-breadcrumb-item>
            <el-breadcrumb-item>Articles List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20" >
                <el-col :span="16" :offset="5">
                    <el-input  placeholder="Please input" @clear="getGoodList" v-model="queryInfo.query"  clearable  class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodList" />
                    </el-input>
                </el-col>
                <el-col :span="2" >
                    <el-button type="primary" @click="toAddPage" >New Product</el-button>
                </el-col>
            </el-row>

            <el-table  :data="goodList" border class="the"  style="width: 100%">
                <el-table-column align="center" label="No."   type="index"       width="50"/>
                <el-table-column align="center" label="Product Name"    prop="goods_name"  width="500"/>
                <el-table-column align="center" label="Price"   prop="goods_price"     width="80"/>
                <el-table-column align="center" label="Stock" prop="goods_weight"    width="80"/>
                <el-table-column align="center" label="Enroll. Date"    prop="add_time" width="170"/>
                <el-table-column align="center" label="Operations"   width="180">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="Edit the Product name" placement="top-start" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEditPage(scope.row.goods_id)"/>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="delete the article" placement="top-start" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.goods_id)"/>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
            <!--The pagination of the user list-->
            <el-pagination class="page"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="queryInfo.pagenum"
                           :page-sizes="[5,10,15,20,25,30,50]"
                           :page-size=queryInfo.pagesize
                           background
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    // import {JSONSchema4 as $utils} from "json-schema";

    export default
    {
        name: "List",
        data()
        {
            return{

                goodList:[],
                total:0,
                addDialogVisible:false,
                queryInfo:
                    {
                        query:'',
                        pagenum:1,
                        pagesize:6,
                    }
            }
        },
        computed:
            {

            },
        created()
        {

            this.getGoodList()
        },

        methods:
            {

                async getGoodList()
                {
                    const {data:res}= await this.$http.get('goods',{params:this.queryInfo})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("Getting the goods list has failed")
                    }

                    for (let item of res.data.goods)
                    {
                        item.add_time = this.$utils.formatToTime(item.add_time)
                    }
                    this.goodList=res.data.goods
                    this.total=res.data.total
                    console.log(this.goodList)

                },
                //    the pagination
                handleSizeChange(pagesize)
                {
                    this.queryInfo.pagesize=pagesize
                    this.getGoodList()
                    console.log(`${pagesize} items per page`);
                },
                handleCurrentChange(pagenum)
                {
                    this.queryInfo.pagenum=pagenum
                    this.getGoodList()
                },

                deleteUserById(id)
                {
                    this.$confirm('Would you permanently delete this Article ?', 'Warning',
                        {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        })
                        .then(async () =>
                        {
                            const {data:res} = await this.$http.delete(`goods/${id}`)
                            if(res.meta.status!==200)
                            {
                                return this.$message.error("Deleting the article has failed")
                            }
                            await this.getGoodList();//get all the users
                            this.$message.success('You have successfuly deleted the article')
                        })
                        .catch(() =>
                        {
                            this.$message({type: 'info', message: 'Delete canceled' });
                        });
                },
                toAddPage()
                {
                    this.$router.push("/goods/add")
                },
                toEditPage(id)
                {
                    this.$router.push("/goods/edit?id="+id)
                },
            }
    }

</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}

</style>
