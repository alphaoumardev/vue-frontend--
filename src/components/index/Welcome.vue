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

        </el-card>
    </div>
</template>

<script>
    export default
    {
        name: "Welcome",

    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}

</style>
