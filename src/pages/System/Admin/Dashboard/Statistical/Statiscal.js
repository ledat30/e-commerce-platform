import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PieChart = ({ dataSummary }) => {
    const [listOrderMonth, setListOrderMonth] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyRevenueAdmin)) {
            const uniqueYears = Array.from(new Set(dataSummary.monthlyRevenueAdmin.map(item => item.month.split('-')[0])));

            const yearOptions = uniqueYears.map(year => ({ value: year, label: year }));

            setYears(yearOptions);
            setSelectedYear(yearOptions[0]);
        } else {
            console.warn('dataSummary or dataSummary.monthlyRevenueAdmin is not correctly defined');
        }
    }, [dataSummary]);

    useEffect(() => {
        if (selectedYear && dataSummary && Array.isArray(dataSummary.monthlyRevenueAdmin)) {
            const selectedYearValue = selectedYear.value;

            const monthsOfSelectedYear = Array.from({ length: 12 }, (v, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return { value: `${selectedYearValue}-${month}`, label: `tháng ${i + 1}` };
            });

            const revenueByMonth = dataSummary.monthlyRevenueAdmin.reduce((acc, curr) => {
                acc[curr.month] = curr.adminRevenue;
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
                        label: 'Total Revenue per Month',
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

    const handleToDetailRevenue = () => {
        navigate(`/admin/revenue`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ paddingTop: '20px', display: 'flex' }}>
                <button
                    className="btn btn-success refresh"
                    onClick={handleToDetailRevenue}
                >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Detail
                </button>
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
            <div style={{ width: '720px', height: '390px', paddingTop: '20px' }}>
                <Bar data={filteredData()} options={options} width={700} height={410} />
                <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                    Biểu đồ cột thống kê doanh thu
                </div>
            </div>
        </div>
    );
};

export { PieChart };