<template>
    <div>
        <!--The template row-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Welcome</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="15">
            <el-col :span="6">
                <div class="statistics" style="background:dodgerblue">
                    <div class="title">
                        <p>Number of Users</p>
                        <el-tag size="mini" type="success">Live</el-tag>
                    </div>
                    <div class="number">{{totalUsers}}</div>
                    <div class="info">Total of Users</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="statistics" style="background:orange">
                    <div class="title">
                        <p>Number of Product</p>
                        <el-tag size="mini" type="success">Live</el-tag>
                    </div>
                    <div class="number">{{totalGoods}}</div>
                    <div class="info">Total of Products</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="statistics" style="background:yellowgreen">
                    <div class="title">
                        <p>Number of Order</p>
                        <el-tag size="mini" type="success">Live</el-tag>
                    </div>
                    <div class="number">{{totalOrders}}</div>
                    <div class="info">Total of Orders</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="statistics" style="background:lightsteelblue">
                    <div class="title">
                        <p>Number of Expedition</p>
                        <el-tag size="mini" type="success">Live</el-tag>
                    </div>
                    <div class="number">{{totalSales}}</div>
                    <div class="info">Total of Expeditions</div>
                </div>
            </el-col>
        </el-row>
        <div class="echarts">
            <el-card id="chart1"></el-card>
            <el-card id="chart2"></el-card>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default
    {
        name: "Welcome",
        data()
        {
            return {
                totalUsers:0,
                totalGoods:0,
                totalOrders:0,
                totalSales:0,
                orderList:[],
            }
        },
        created()
        {
            this.getUserList()
            this.getGoodList()
            this.getOrderList()
            // this.get
        },
        methods:
            {
                async getUserList()
                {
                    const {data:res}= await this.$http.get('users',{params:{pagenum:1,pagesize:1}})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("You have an error to get the total of the users")
                    }
                    this.totalUsers =res.data.total;
                },
                async getGoodList()
                {
                    const {data:res}= await this.$http.get('goods',{params:{pagenum:1,pagesize:1}})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("You have an error to get the total of the users")
                    }
                    this.totalGoods =res.data.total;
                },
                async getOrderList()
                {
                    const {data:res}= await this.$http.get('orders',{params:{pagenum:1,pagesize:1}})
                    if(res.meta.status!==200)
                    {
                        return this.$message.error("You have an error to get the total of the users")
                    }
                    this.totalOrders =res.data.total;
                    this.orderList =res.data.goods
                    this.orderList.forEach(item =>
                    {
                        if(item.pay_status ==='1')
                        {
                            this.totalSales += item.order_price
                        }
                    })
                    this.initChart1()
                    this.initChart2()
                },

                initChart1()
                {
                    // 创建echarts实例
                    const chart1 = echarts.init(document.getElementById('chart1'));

                    const option =
                        {
                        title:
                        {
                            text: 'Order Tendance',
                        },
                        tooltip:
                        {
                            trigger: 'axis',
                            axisPointer:
                            {
                                type: 'line',
                            },
                        },
                        xAxis:
                        {
                            type: 'category',
                            data:[]//  ['03.20', '03.21'],
                        },
                        yAxis:
                        {
                            type: 'value',
                        },
                        series:
                        [
                            {
                                type: 'line',
                                smooth: true,
                                data:[]// [260, 406]
                            },
                        ],
                    };

                //
                //     // 升序排序
                    this.orderList.sort(function (a, b)
                    {
                        return a.create_time - b.create_time
                    })

                    // 获取日期及订单总额
                    let data = []
                    this.orderList.forEach((item) =>
                    {
                        if (item.pay_status === '1')
                        {
                            let key = this.$utils.formatToDate(item.create_time)

                            if (!data[key])
                            {
                                data[key] = item.order_price
                            }
                            else
                            {
                                data[key] += item.order_price
                            }
                        }
                        console.log(data)
                    })
                //
                //     // 将数据添加到option中
                    for (let key in data)
                    {
                        option.xAxis.data.push(key)
                        option.series[0].data.push(data[key])
                    }

                    chart1.setOption(option)
                },
                initChart2()
                {
                    const chart2 = echarts.init(document.getElementById('chart2'));

// 订单状态
                   let option =
                   {
                        title:
                        {
                            text: 'Order Status',
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b} : {c} ({d}%)',
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'right',
                            data: [],
                        },
                        series: [
                            {
                                name: 'Status',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                // data: [
                                //     {value: 335, name: '直接访问'},
                                //     {value: 310, name: '邮件营销'},
                                //     {value: 234, name: '联盟广告'},
                                //     {value: 135, name: '视频广告'},
                                //     {value: 1548, name: '搜索引擎'}
                                // ],
                                data: [],
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    },
                                },
                            },
                        ],
                    }

                    let data =
                        [
                            {
                                name:'Paid',
                                value: 0,
                            },
                            {
                                name:'Unpaid',
                                value: 0,
                            },
                        ]
                    this.orderList.forEach((item) =>
                    {
                        if (item.pay_status === '1')
                        {
                            data[0].value++
                        }
                        else
                        {
                            data[1].value++
                        }
                    })
                    //     // 将数据添加到option中
                    for (let item of data)
                    {
                        option.legend.data.push(item.name)
                        option.series[0].data.push(item)
                    }
                    //
                    chart2.setOption(option)
                }

            }
    }
</script>

<style scoped>
    .el-breadcrumb{font:20px bold;}
    .el-row{padding:0 10px;}
    .statistics{color:white; height:100px;border-radius: 6px; padding:0 5px;}
    .title{display:flex;justify-content: space-between; align-items:center;}
    p{font-size:16px;font-weight:bold;}
    .number{font-size:25px;font-weight: bold; text-align:center;}

    .echarts{display:flex;justify-content: space-between;margin-top:10px; }
    .el-card{height:400px; width:50%;padding:20px; margin:0 8px;}

</style>
