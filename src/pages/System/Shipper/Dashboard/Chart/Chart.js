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
    const [listOrderMonth, setListOrderMonth] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([]);

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyOrders)) {
            const months = dataSummary.monthlyOrders.map(order => ({
                value: order.month,
                label: order.month,
            }));
            const monthsList = dataSummary.monthlyOrders.map(order => order.month);
            const totals = dataSummary.monthlyOrders.map(order => order.totalOrders);
            setMonths(months);
            setListOrderMonth(monthsList);
            setMonthlyTotals(totals);
        } else {
            console.warn('dataSummary or dataSummary.monthlyOrders is not correctly defined');
        }
    }, [dataSummary]);

    const filteredData = () => {
        if (selectedMonth) {
            const index = listOrderMonth.indexOf(selectedMonth.value);
            return {
                labels: [selectedMonth.label],
                datasets: [
                    {
                        label: 'Total Orders per Month',
                        data: [monthlyTotals[index]],
                        backgroundColor: 'rgba(75,192,192,0.6)',
                    },
                ],
            };
        } else {
            return {
                labels: listOrderMonth,
                datasets: [
                    {
                        label: 'Total Orders per Month',
                        data: monthlyTotals,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                    },
                ],
            };
        }
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
            <Select
                options={months}
                value={selectedMonth}
                onChange={setSelectedMonth}
                isClearable={true}
                placeholder="Select month"
            />
            <Bar data={filteredData()} options={options} width={400} height={360} />
            <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                Biểu đồ cột thống kê tần suất đơn theo tháng
            </div>
        </div>
    )
};

export { Barchart, PieChart };

