import Order from "../models/order.model.js";
import User from "../models/user.model.js"

export const dataForCarts = async (req,res)=>{
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7*24*60*60*1000);

        const dailySalesData = await getDailySalesData(startDate,endDate);

        res.status(200).json({
            analyticsData,
            dailySalesData
        })
    } catch (error) {
        res.status(500).json({error : "while fetching data from carts : "+error.message})
    }
}



//supportin functions
const getAnalyticsData = async (req,res)=>{
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group : {
                    _id : null, //it group all docs together
                    totalSales : {$sum : 1},
                    totalRevenue : {$sum:"$totalAmount"}
                }
            }
        ])

        const {totalSales, totalRevenue} = salesData[0] || {totalSales : 0,totalRevenue : 0};

        return {
            users : totalUsers,
            products : totalProducts,
            totalSales,
            totalRevenue
        }
}





async function getDailySalesData(startDate, endDate){
    const dailySalesData = await Order.aggregate([
        {
            $match : {
                createdAt : {
                    $gte : startDate,
                    $lte : endDate
                }
            }
        },
        {
            $group : {
                _id : { $dateToString : {format : "%Y-%m-%d", date : "$createdAt"}},
                sales : {$sum : 1},
                revenue : {$sum : "$totalAmount"}
            }
        },
        { $sort : { _id : 1 }}
    ])

    //get data in the form of 
    //  [
    //     {
    //         _id : "2024-08-18",
    //         sales : 12,
    //         revenue : 123.5
    //     },
    //     {
    //         _id : "2024-08-19",
    //         sales : 12,
    //         revenue : 123.5
    //     },
    //  ]

    const dateArray = getDatesInRange(startDate,endDate);

    return dateArray.map(date=>{
        const foundData = dailySalesData.find(item=>item.id===date);

        return {
            date,
            sales : foundData?.sales || 0,
            revenue : foundData?.revenue || 0 
        }
    })
}

function getDatesInRange(startDate,endDate){
    const dates = [];
    let currentDate = new Date(startDate);
    while(currentDate <= endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1);
    }
    return dates;
}