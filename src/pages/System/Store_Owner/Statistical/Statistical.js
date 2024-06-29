import './Statistical.scss';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { storeStatistical } from '../../../../services/storeService';
import SellerProduct from './SellerProduct/SellerProduct';
import TopView from './TopView/TopView';
import OrderByArea from './OrderByArea/OrderByArea';
import ShippingUnit from './ShippingUnit/ShippingUnit';

function Statistical() {
    const { user } = useContext(UserContext);
    const [dataStatistical, setDataStatistical] = useState([]);
    const [activeItem, setActiveItem] = useState('product');

    useEffect(() => {
        fetchDataSummary();
    }, [user.account.storeId]);

    const fetchDataSummary = async () => {
        let response = await storeStatistical(user.account.storeId);

        if (response && response.EC === 0) {
            setDataStatistical(response.DT);
        }
    }

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    return (
        <div className='container' >
            <h5>Trang quản lý thống kê</h5>
            <div className='summary'>
                <div
                    className={`summary_item ${activeItem === 'product' ? 'active' : ''}`}
                    onClick={() => handleItemClick('product')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Sản phẩm bán chạy nhất</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-product-hunt" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'views' ? 'active' : ''}`}
                    onClick={() => handleItemClick('views')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Sản phẩm xem nhiều nhất</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-eye" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'address' ? 'active' : ''}`}
                    onClick={() => handleItemClick('address')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Khu vực có lượng mua lớn</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'truck' ? 'active' : ''}`}
                    onClick={() => handleItemClick('truck')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Đơn vị vận chuyển</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className='container-content'>
                {activeItem === 'product' && <SellerProduct dataStatistical={dataStatistical} />}
                {activeItem === 'views' && <TopView dataStatistical={dataStatistical} />}
                {activeItem === 'address' && <OrderByArea dataStatistical={dataStatistical} />}
                {activeItem === 'truck' && <ShippingUnit dataStatistical={dataStatistical} />}
            </div>
        </div>
    );
}

export default Statistical;