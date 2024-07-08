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
    const [months, setMonths] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (dataSummary && Array.isArray(dataSummary.monthlyRevenueByStore)) {
            const months = dataSummary.monthlyRevenueByStore.map(order => ({
                value: order.month,
                label: order.month,
            }));
            const monthsList = dataSummary.monthlyRevenueByStore.map(order => order.month);
            const totals = dataSummary.monthlyRevenueByStore.map(order => order.totalRevenue);
            setMonths(months);
            setListOrderMonth(monthsList);
            setMonthlyTotals(totals);
        } else {
            console.warn('dataSummary or dataSummary.totalRevenue is not correctly defined');
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

    const handleToDetailRevenue = () => {
        navigate(`/store-owner/revenue`)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ paddingTop: '20px', display: 'flex' }}>
                <button
                    className="btn btn-success refresh"
                    onClick={() => handleToDetailRevenue()}
                >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Detail
                </button>
                <div style={{ marginLeft: '10px', marginRight: '-255px', width: '200px' }}>
                    <Select
                        options={months}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        isClearable={true}
                        placeholder="Select month"
                    />
                </div>
            </div>
            <div style={{ width: '720px', height: '390px', paddingTop: '20px' }}>
                <Bar data={filteredData()} options={options} width={700} height={410} />
                <div style={{ fontSize: '15px', paddingLeft: '22px', paddingTop: '15px' }}>
                    Biểu đồ cột thống kê tần suất đơn theo tháng
                </div>
            </div>
        </div>
    )
};

export { PieChart };