import { useEffect, useState } from 'react';
import Select from "react-select";
import ReactPaginate from "react-paginate";

function TopSellerProduct({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (dataStatistical && dataStatistical.topSellerProducts) {
            const allProducts = dataStatistical.topSellerProducts.flatMap(store => store.products);
            setAllProducts(allProducts);
            setSellerProducts(allProducts);
            setTotalPages(Math.ceil(allProducts.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    useEffect(() => {
        const productMap = sellerProducts.reduce((acc, item) => {
            const productName = item.ProductAttribute.Product.product_name;
            if (acc[productName]) {
                acc[productName].quantity_sold += item.quantity_sold;
            } else {
                acc[productName] = { ...item, quantity_sold: item.quantity_sold };
            }
            return acc;
        }, {});

        const aggregatedProducts = Object.values(productMap);

        const filteredData = aggregatedProducts.filter((item) =>
            item.ProductAttribute.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
        );

        setFilteredProducts(filteredData);
        setTotalPages(Math.ceil(filteredData.length / currentLimit));
    }, [sellerProducts, searchInput, currentLimit]);

    const uniqueStores = [...new Map(allProducts.map(item => [item.Store.id, item.Store])).values()].map(store => ({
        value: store.id,
        label: store.name
    }));

    const handleStoreChange = (selected) => {
        setSelectedStoreId(selected ? selected.value : null);
        if (selected) {
            const storeProducts = allProducts.filter(item => item.Store.id === selected.value);
            setSellerProducts(storeProducts);
        } else {
            setSellerProducts(allProducts);
        }
    };

    const handleRefresh = () => {
        setSelectedStoreId(null);
        setSearchInput("");
        setSellerProducts(allProducts);
    };

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedSellerProduct = filteredProducts.slice(startIndex, startIndex + currentLimit);
        if (selectedSellerProduct.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="5">Not Found...</td>
                </tr>
            );
        }
        return selectedSellerProduct.map((sellerProduct, index) => (
            <tr key={sellerProduct.id}>
                <td>{startIndex + index + 1}</td>
                <td>{sellerProduct.ProductAttribute.id}</td>
                <td>{sellerProduct.ProductAttribute.Product.product_name}</td>
                <td>
                    <span style={{ backgroundColor: '#ccd7e7', padding: '2px 7px', borderRadius: '4px' }}>{sellerProduct.quantity_sold} đã bán</span>
                </td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };
    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý mặt hàng bán chạy</div>
                <span style={{ marginTop: '10px', marginLeft: '-30px' }}>
                    <button
                        title="refresh"
                        className="btn btn-success refresh"
                        onClick={() => handleRefresh()}
                    >
                        <i className="fa fa-refresh"></i> Refesh
                    </button>
                </span>
                <div style={{ width: '250px', marginTop: '4px', marginBottom: '-12px' }}>
                    <Select
                        className='mb-4 select'
                        value={uniqueStores.find(option => option.value === selectedStoreId) || null}
                        onChange={handleStoreChange}
                        options={uniqueStores}
                    />
                </div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type=""
                            placeholder="Tìm kiếm ..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style={{ width: '100px' }}>No</th>
                        <th style={{ width: '200px' }}>Id</th>
                        <th>Product</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {renderViews()}
                </tbody>
            </table>
            {
                totalPages > 0 && (
                    <div className="user-footer mt-3">
                        <ReactPaginate
                            nextLabel="sau >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel="< Trước"
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
                )
            }
        </div >
    );
}

export default TopSellerProduct;