import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";

export const getAnalyticsData = async (req, res) => {
    try {
        const exAnalyticsData = await analyticsData();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days from now

        const exDailySalesData = await dailySalesData(startDate, endDate);

        res.status(200).json({
            exAnalyticsData,
            exDailySalesData
        })


    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const analyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesDate = await Order.aggregate([
        {
            $group: {
                _id: null, // it groups all documents together,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const { totalSales, totalRevenue } = salesDate[0] || { totalSales: 0, totalRevenue: 0 };
    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue
    }
}

const dailySalesData = async (startDate, endDate) => {

    try {
        const getDailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // example of dailySalesData
        // [
        // 	{
        // 		_id: "2024-08-18",
        // 		sales: 12,
        // 		revenue: 1450.75
        // 	},
        // ]

        const dateArray = getDatesInRange(startDate, endDate);
        // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

        return dateArray.map((date) => {
            const foundData = getDailySalesData.find((item) => item._id === date);
            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        })

    } catch (error) {
        throw error;

    }
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}