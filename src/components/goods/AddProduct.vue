<template>
    <div>
        <!--The template row-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods'}">Product list</el-breadcrumb-item>
            <el-breadcrumb-item>Product Management</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="Please fill the product details below" :closable="false" center type="success" show-icon/>
            <el-steps :active="active-0" finish-status="success" align-center>
                <el-step title="Basic Information"/>
                <el-step title="Product Details"/>
                <el-step title="Product Info."></el-step>
                <el-step title="Product Image"></el-step>
                <el-step title="Product content"></el-step>
                <el-step title="Done"></el-step>
            </el-steps>
<!--            The tabs-->
            <el-tabs v-model="active" tab-position="left" style="height: 200px;">
                <el-tab-pane name="0" label="Basic Information">User Management</el-tab-pane>
                <el-tab-pane name="1" label="Product Details">Configuration</el-tab-pane>
                <el-tab-pane name="2" label="Product Info.">Role</el-tab-pane>
                <el-tab-pane name="3" label="Product Image">Tasks</el-tab-pane>
                <el-tab-pane name="4" label="Product content">Tasks</el-tab-pane>
                <el-tab-pane name="5" label="Done">Tasks</el-tab-pane>
            </el-tabs>

        </el-card>
    </div>
</template>

<script>
    export default
    {
        name: "AddProduct",
        data()
        {return{
            active:'0',
        }},
        created()
        {

        },
        methods:
            {

            }

    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}

</style>
