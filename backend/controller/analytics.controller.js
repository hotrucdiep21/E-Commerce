import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

export const analyticsData = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySaleData = await getDailySaleData(startDate, endDate);

        res.json({
            analyticsData,
            dailySaleData
        })
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Error in analytics route", error: error.message });
    }
}

export const dailySaleData = async (startDate, endDate) => {
    try {
        const dailySaleData = await Order.aggregate([
            {
                $match: {
                    $createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                        $sale: { $sum: 1 },
                        revenue: { $sum: "$totalAmount" }
                    },
                },
            },
            { $sort: { _id: 1 } },
        ])

        //example 
        // [
        //     {
        //         _id: "2024-01-01",
        //         sale: 100,
        //         revenue: 10000
        //     }
        // ]


        const dateArray = getDatesInRange(startDate, endDate);
        // console.log(['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']);

        return dateArray.map((date) => {
            const foundData = dailySaleData.find((item) => item._id === date);
            return {
                date: date,
                sale: foundData?.sale || 0,
                revenue: foundData?.revenue || 0
            }
        })
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Error in daily sale route", error: error.message });
    }

}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return dates;
}

async function getAnalyticsData() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const saleData = await Order.aggregate([
        {
            $group: {
                _id: null, //it group all documents together
                totalSale: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }


    ]);

    const { totalSale, totalRevenue } = saleData[0] || { totalSale: 0, totalRevenue: 0 };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSale,
        totalRevenue
    }

}