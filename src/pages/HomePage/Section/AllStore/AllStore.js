import './AllStore.scss';
import Footer from "../../Footer/Footer";
import HeaderHome from "../../HeaderHome/HeaderHome";
import { Link } from "react-router-dom";
import { getAllStores } from '../../../../services/storeService';
import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
const { Buffer } = require("buffer");

function AllStore() {
    const [listStores, setListStores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect(() => {
        fectListStores();
    }, [currentPage, currentLimit]);

    const fectListStores = async () => {
        let response = await getAllStores(currentPage, currentLimit);
        if (response && response.EC === 0) {
            setListStores(response.DT.stores);
            setTotalPages(response.DT.totalPages);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="container-store">
            <HeaderHome />
            <div className="grid wide">
                <div className='content-store'>
                    <div className="title">
                        <div className="title-name">Tất cả cửa hàng</div>
                    </div>
                    <div className='store'>
                        {listStores && listStores.length > 0 && listStores.map((item, index) => {
                            let imageBase64 = '';
                            imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
                            return (
                                <Link className='store_item' key={index} to={`/store/${item.id}`}>
                                    <div className='img_store' style={{ backgroundImage: `url(${imageBase64})` }}>
                                    </div>
                                    <div className='name_store'>
                                        {item.name}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    {totalPages > 0 && (
                        <div className="user-footer mt-3 pb-2">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination justify-content-center"
                                activeclassname="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AllStore;