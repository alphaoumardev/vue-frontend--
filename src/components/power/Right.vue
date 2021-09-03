<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users'}">User list</el-breadcrumb-item>
            <el-breadcrumb-item>User Management</el-breadcrumb-item>
        </el-breadcrumb>
        <!--The card box-->
        <el-card class="box-card">
            <el-table :data="rightsList" border stripe>
                <el-table-column align="center" label="No."        type="index"       width="120"/>
                <el-table-column align="center" label="Right Name" prop="authName"  width="340"/>
                <el-table-column align="center" label="Route"      prop="path"     width="340"/>
                <el-table-column align="center" label="Level"      width="350">
                    <template slot-scope="scope">
                        <el-tag  v-if="scope.row.level==='0'" type="success">lev 1</el-tag>
                        <el-tag  v-if="scope.row.level==='1' " type="warning">lev 2</el-tag>
                        <el-tag v-if="scope.row.level==='2' ">lev 3</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default
    {
        name: "Right",
        data()
        {
            return{
                rightsList:[],

            }
        },

        created()
        {
            this.getRightList()
        },
        methods:
            {
               async getRightList()
                {
                    const {data:res} =await this.$http.get('rights/list')
                    if(res.meta.status !==200)
                    {
                        return this.$message.error("Getting the user rights list failed")
                    }
                    this.rightsList=res.data
                }
            }
    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
</style>
