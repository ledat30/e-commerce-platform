import { useEffect, useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { shipperDashboardSummary } from '../../../../services/productService';
import Order from './Order/Order';
import Revenue from './Revenue/Revenue';
import { Barchart, PieChart } from './Chart/Chart';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [dataSummary, setDataSummary] = useState([]);
  const [activeItem, setActiveItem] = useState('orders');

  useEffect(() => {
    fetchDataSummary();
  }, [user.account.id]);

  const fetchDataSummary = async () => {
    let response = await shipperDashboardSummary(user.account.id);

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

  const formatPrice = (dataSummary.totalRevenue * 1).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

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
          className={`summary_item1 ${activeItem === 'revenue' ? 'active' : ''}`}
          onClick={() => handleItemClick('revenue')}
        >
          <div className='summary_left'>
            <div className='number'>{formatPrice}</div>
            <div className='text'>Doanh thu</div>
          </div>
          <div className='summary_right'>
            <i className="fa fa-money" aria-hidden="true"></i>
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
        {activeItem === 'revenue' && <Revenue />}
        {activeItem === 'statistical' && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Barchart dataSummary={dataSummary} />
            <PieChart dataSummary={dataSummary} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;