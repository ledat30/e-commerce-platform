import { useEffect, useState } from 'react';
import './Dashboard.scss';
import { adminDashboardSummary } from '../../../../services/storeService';
import Order from './Order/Order';
import Product from './Product/Product';
import User from './User/User';
import { PieChart } from './Statistical/Statiscal';

function DashboardAdmin() {
  const [dataSummary, setDataSummary] = useState([]);
  const [activeItem, setActiveItem] = useState('orders');

  useEffect(() => {
    fetchDataSummary();
  }, []);

  const fetchDataSummary = async () => {
    let response = await adminDashboardSummary();

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
            <div className='number'>{formatNumber(dataSummary.warningUsersCount)}</div>
            <div className='text'>Cảnh báo tài khoản</div>
          </div>
          <div className='summary_right'>
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          </div>
        </div>
        <div
          className={`summary_item ${activeItem === 'products' ? 'active' : ''}`}
          onClick={() => handleItemClick('products')}
        >
          <div className='summary_left'>
            <div className='number'>{formatNumber(dataSummary.totalProducts)}</div>
            <div className='text'>Sản phẩm</div>
          </div>
          <div className='summary_right'>
            <i className="fa fa-product-hunt" aria-hidden="true"></i>
          </div>
        </div>
        <div
          className={`summary_item ${activeItem === 'users' ? 'active' : ''}`}
          onClick={() => handleItemClick('users')}
        >
          <div className='summary_left'>
            <div className='number'>{formatNumber(dataSummary.totalUsers)}</div>
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
        {activeItem === 'products' && <Product />}
        {activeItem === 'users' && <User />}
        {activeItem === 'statistical' && (
          <PieChart dataSummary={dataSummary} />
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;