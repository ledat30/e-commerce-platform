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
        <div style={{ width: '350px', height: '350px', paddingTop: '20px' }}>
            <Pie data={data} options={options1} width={400} height={400} />
            <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>Biểu đồ tròn quản lý đơn thành công hoặc thất bại </div>
        </div>
    );
};

const PieChart = ({ dataSummary }) => {
    console.log(dataSummary);
    const [listOrderMonth, setListOrderMonth] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyOrders)) {
            const uniqueYears = Array.from(new Set(dataSummary.monthlyOrders.map(item => item.month.split('-')[0])));

            const yearOptions = uniqueYears.map(year => ({ value: year, label: year }));

            setYears(yearOptions);
            setSelectedYear(yearOptions[0]);
        } else {
            console.warn('dataSummary or dataSummary.monthlyOrders is not correctly defined');
        }
    }, [dataSummary]);

    useEffect(() => {
        if (selectedYear && dataSummary && Array.isArray(dataSummary.monthlyOrders)) {
            const selectedYearValue = selectedYear.value;

            const monthsOfSelectedYear = Array.from({ length: 12 }, (v, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return { value: `${selectedYearValue}-${month}`, label: `tháng ${i + 1}` };
            });

            const revenueByMonth = dataSummary.monthlyOrders.reduce((acc, curr) => {
                acc[curr.month] = curr.totalOrders;
                return acc;
            }, {});

            const totals = monthsOfSelectedYear.map(month => revenueByMonth[month.value] || 0);

            setListOrderMonth(monthsOfSelectedYear.map(month => month.value));
            setMonthlyTotals(totals);
            setMonths(monthsOfSelectedYear);
        }
    }, [selectedYear, dataSummary]);

    const filteredData = () => {
        if (selectedMonth) {
            const index = listOrderMonth.indexOf(selectedMonth.value);
            return {
                labels: [selectedMonth.label],
                datasets: [
                    {
                        label: 'Total Revenue per Month',
                        data: [monthlyTotals[index]],
                        backgroundColor: 'rgba(75,192,192,0.6)',
                    },
                ],
            };
        } else {
            return {
                labels: listOrderMonth.map(month => {
                    const [, monthNumber] = month.split('-');
                    return `tháng ${parseInt(monthNumber)}`;
                }),
                datasets: [
                    {
                        label: 'Total orders per Month',
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ paddingTop: '20px', display: 'flex' }}>
                <div style={{ marginLeft: '10px', width: '200px' }}>
                    <Select
                        options={months}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        isClearable={true}
                        placeholder="Select month"
                    />
                </div>
                <div style={{ marginLeft: '10px', width: '200px' }}>
                    <Select
                        options={years}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        isClearable={false}
                        placeholder="Select year"
                    />
                </div>
            </div>
            <div style={{ width: '720px', height: '350px', paddingTop: '20px' }}>
                <Bar data={filteredData()} options={options} width={700} height={410} />
                <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                    Biểu đồ cột thống kê doanh thu theo tháng
                </div>
            </div>
        </div>
    );
};

export { Barchart, PieChart };

