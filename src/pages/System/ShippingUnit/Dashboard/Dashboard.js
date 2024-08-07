import { useEffect, useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import './Dashboard.scss';
import { shippingUnitDashboard } from '../../../../services/shippingUnitService';
import Order from './Order/Order';
import User from './User/User';
import { Barchart, PieChart } from './BarChart/BarChart';

function Dashboard() {
    const { user } = useContext(UserContext);
    const [dataSummary, setDataSummary] = useState([]);
    const [activeItem, setActiveItem] = useState('orders');

    useEffect(() => {
        fetchDataSummary();
    }, [user.account.shipingUnitId]);

    const fetchDataSummary = async () => {
        let response = await shippingUnitDashboard(user.account.shipingUnitId);

        if (response && response.EC === 0) {
            setDataSummary(response.DT);
        }
    }

    const formatNumber = (number) => {
        return number ? number.toLocaleString() : 0;
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const formatPrice = (dataSummary.totalRevenue * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className='container' >
            <h5>Trang quản lý thống kê</h5>
            <div className='summary'>
                <div
                    className={`summary_item1 ${activeItem === 'orders' ? 'active' : ''}`}
                    onClick={() => handleItemClick('orders')}
                >
                    <div className='summary_left'>
                        <div className='number'>{formatNumber(dataSummary.totalOrders)}</div>
                        <div className='text'>Đơn hàng</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item1 ${activeItem === 'users' ? 'active' : ''}`}
                    onClick={() => handleItemClick('users')}
                >
                    <div className='summary_left'>
                        <div className='number'>{formatNumber(dataSummary.totalShippers)}</div>
                        <div className='text'>Người vận chuyển</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item1 ${activeItem === 'statistical' ? 'active' : ''}`}
                    onClick={() => handleItemClick('statistical')}
                >
                    <div className='summary_left'>
                        <div className='text1'>Biểu đồ thống kê</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className='container-content'>
                {activeItem === 'orders' && <Order />}
                {activeItem === 'users' && <User dataSummary={dataSummary} />}
                {activeItem === 'statistical' && (
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: '90px' }}>
                        <div style={{ marginTop: '50px' }}>
                            <Barchart dataSummary={dataSummary} />
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <PieChart dataSummary={dataSummary} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;