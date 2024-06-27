import { useEffect, useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import './Dashboard.scss';
import { storeDashboard } from '../../../../services/storeService';
import Order from './Order/Order';
import Comment from './Comment/Comment';
import View from './View/View';
import User from './User/User';
import { PieChart } from './Statistical/Statistical';

function DashboardStore() {
    const { user } = useContext(UserContext);
    const [dataSummary, setDataSummary] = useState([]);
    const [activeItem, setActiveItem] = useState('orders');

    useEffect(() => {
        fetchDataSummary();
    }, [user.account.storeId]);

    const fetchDataSummary = async () => {
        let response = await storeDashboard(user.account.storeId);

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

    return (
        <div className='container' >
            <h5>Trang quản lý thống kê</h5>
            <div className='summary'>
                <div
                    className={`summary_item ${activeItem === 'orders' ? 'active' : ''}`}
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
                    className={`summary_item ${activeItem === 'views' ? 'active' : ''}`}
                    onClick={() => handleItemClick('views')}
                >
                    <div className='summary_left'>
                        <div className='number'>{formatNumber(dataSummary.totalViews)}</div>
                        <div className='text'>Lượt xem</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-eye" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'comments' ? 'active' : ''}`}
                    onClick={() => handleItemClick('comments')}
                >
                    <div className='summary_left'>
                        <div className='number'>{formatNumber(dataSummary.totalComments)}</div>
                        <div className='text'>Bình luận</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-comments" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'users' ? 'active' : ''}`}
                    onClick={() => handleItemClick('users')}
                >
                    <div className='summary_left'>
                        <div className='number'>{formatNumber(dataSummary.totalUniqueCustomers)}</div>
                        <div className='text'>Người dùng</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'statistical' ? 'active' : ''}`}
                    onClick={() => handleItemClick('statistical')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '14px', paddingTop: '15px' }}>Biểu đồ thống kê</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className='container-content'>
                {activeItem === 'orders' && <Order />}
                {activeItem === 'views' && <View dataSummary={dataSummary} />}
                {activeItem === 'comments' && <Comment />}
                {activeItem === 'users' && <User dataSummary={dataSummary} />}
                {activeItem === 'statistical' && (
                    <PieChart dataSummary={dataSummary} />
                )}
            </div>
        </div>
    );
}

export default DashboardStore;