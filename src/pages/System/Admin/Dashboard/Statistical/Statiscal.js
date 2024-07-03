import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

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
        <div style={{ width: '290px', height: '405px', paddingTop: '20px' }}>
            <Pie data={data} options={options1} width={270} height={400} />
            <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>Biểu đồ tròn quản lý đơn thành công hoặc thất bại </div>
        </div>
    );
};


const PieChart = ({ dataSummary }) => {
    const [listOrderMonth, setListOrderMonth] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyStoreOrders)) {
            const storeMap = new Map();
            dataSummary.monthlyStoreOrders.forEach(order => {
                if (!storeMap.has(order.storeId)) {
                    storeMap.set(order.storeId, { value: order.storeId, label: order.storeName });
                }
            });

            const uniqueStores = Array.from(storeMap.values());
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

    const handleToDetailRevenue = () => {
        navigate(`/admin/revenue`)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ paddingTop: '20px', display: 'flex' }}>
                <button
                    className="btn btn-success refresh"
                    onClick={() => handleToDetailRevenue()}
                >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Detail revenue
                </button>
                <span style={{ marginLeft: '10px' }}>
                    <Select
                        options={stores}
                        value={selectedStore}
                        onChange={setSelectedStore}
                        isClearable={true}
                        placeholder="Select a store"
                    />
                </span>
                <span style={{ marginLeft: '10px' }}>
                    <Select
                        options={months}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        isClearable={true}
                        placeholder="Select month"
                    />
                </span>
            </div>
            <div style={{ width: '650px', height: '390px', paddingTop: '20px' }}>
                <div style={{ width: '600px', height: '325px' }}>
                    <Bar data={data1} options={options} />
                </div>

                <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                    Biểu đồ cột tần suất đơn theo tháng
                </div>
            </div>
        </div>
    )
};

export { Barchart, PieChart };