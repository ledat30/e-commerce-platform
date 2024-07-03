import { useEffect, useState } from 'react';
import { adminStatistical } from '../../../../services/storeService';
import TopSellerProduct from './TopSellerProduct/TopSellerProduct';
import TopRevenue from './TopRevenue/TopRevenue';
import ListStoreNew from './ListStoreNew/ListStoreNew';
import TopCategoryUseByProduct from './TopCategoryUseByProduct/TopCategoryUseByProduct';

function Statistical() {
    const [dataStatistical, setDataStatistical] = useState([]);
    const [activeItem, setActiveItem] = useState('product');

    useEffect(() => {
        fetchDataSummary();
    }, []);

    const fetchDataSummary = async () => {
        let response = await adminStatistical();

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
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Sản phẩm bán chạy</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-product-hunt" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'revenue' ? 'active' : ''}`}
                    onClick={() => handleItemClick('revenue')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Doanh thu cửa hàng</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-money" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'storeNew' ? 'active' : ''}`}
                    onClick={() => handleItemClick('storeNew')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Danh sách cửa hàng mới</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-home" aria-hidden="true"></i>
                    </div>
                </div>
                <div
                    className={`summary_item ${activeItem === 'categoryByStore' ? 'active' : ''}`}
                    onClick={() => handleItemClick('categoryByStore')}
                >
                    <div className='summary_left'>
                        <div style={{ fontSize: '13px', paddingTop: '15px' }}>Danh mục ưu thích</div>
                    </div>
                    <div className='summary_right'>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className='container-content'>
                {activeItem === 'product' && <TopSellerProduct dataStatistical={dataStatistical} />}
                {activeItem === 'revenue' && <TopRevenue dataStatistical={dataStatistical} />}
                {activeItem === 'storeNew' && <ListStoreNew dataStatistical={dataStatistical} />}
                {activeItem === 'categoryByStore' && <TopCategoryUseByProduct dataStatistical={dataStatistical} />}
            </div>
        </div>
    );
}

export default Statistical;