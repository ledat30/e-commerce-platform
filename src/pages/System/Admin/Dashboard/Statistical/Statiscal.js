import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Select from 'react-select';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Barchart = ({ dataSummary }) => {
    const [listOrdersFails, setListOrdersFails] = useState([]);
    const [listOrdersSusccess, setListOrderSuccess] = useState([]);

    useEffect(() => {
        if (dataSummary) {
            setListOrdersFails(dataSummary.totalOrderFails || 0);
            setListOrderSuccess(dataSummary.totalOrderSuccess || 0);
        }
    }, [dataSummary]);

    const data = {
        labels: ['Success', 'Fail'],
        datasets: [
            {
                label: '# of Orders',
                data: [listOrdersSusccess, listOrdersFails],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options1 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + ' orders';
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '400px', height: '400px', paddingTop: '20px' }}>
            <Pie data={data} options={options1} width={400} height={400} />
            <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>Biểu đồ tròn quản lý đơn thành công hoặc thất bại </div>
        </div>
    );
};


const PieChart = ({ dataSummary }) => {
    console.log(`dataSummary`, dataSummary);
    const [listOrderMonth, setListOrderMonth] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([]);

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyStoreOrders)) {
            const uniqueStores = [...new Set(dataSummary.monthlyStoreOrders.map(order => ({
                value: order.storeId,
                label: order.storeName
            })))];
            setStores([{ value: '', label: 'All Stores' }, ...uniqueStores]);

            const uniqueMonths = [...new Set(dataSummary.monthlyStoreOrders.map(order => order.month))].map(month => ({
                value: month,
                label: month
            }));
            setMonths(uniqueMonths);
        } else {
            console.warn('dataSummary is not correctly defined');
        }
    }, [dataSummary]);

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyStoreOrders)) {
            let filteredOrders = dataSummary.monthlyStoreOrders;

            if (selectedStore && selectedStore.value) {
                filteredOrders = filteredOrders.filter(order => order.storeId === selectedStore.value);
            }

            if (selectedMonth && selectedMonth.value) {
                filteredOrders = filteredOrders.filter(order => order.month === selectedMonth.value);
            }

            const orderSummaryByMonth = filteredOrders.reduce((acc, order) => {
                const monthIndex = acc.findIndex(item => item.month === order.month);
                if (monthIndex > -1) {
                    acc[monthIndex].totalOrders += order.totalOrders;
                } else {
                    acc.push({ month: order.month, totalOrders: order.totalOrders });
                }
                return acc;
            }, []);

            const months = orderSummaryByMonth.map(order => order.month);
            const totals = orderSummaryByMonth.map(order => order.totalOrders);
            setListOrderMonth(months);
            setMonthlyTotals(totals);
        } else {
            console.warn('dataSummary is not correctly defined');
        }
    }, [dataSummary, selectedStore, selectedMonth]);

    const data1 = {
        labels: listOrderMonth,
        datasets: [
            {
                label: 'Total Orders per Month',
                data: monthlyTotals,
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '400px', height: '360px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <Select
                    options={stores}
                    value={selectedStore}
                    onChange={setSelectedStore}
                    isClearable={true}
                    placeholder="Select a store"
                />
                <Select
                    options={months}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    isClearable={true}
                    placeholder="Select month"
                />
            </div>
            <Bar data={data1} options={options} width={400} height={360} />
            <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                Biểu đồ cột tần suất đơn theo tháng
            </div>
        </div>
    )
};

export { Barchart, PieChart };