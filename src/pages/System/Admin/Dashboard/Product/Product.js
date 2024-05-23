import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { adminDashboardProduct } from '../../../../../services/storeService';
import Select from "react-select";

function Product() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listProducts, setListProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        const filteredData = allProducts.filter((item) => {
            const matchesSearch = item.product_name.toLowerCase().includes(searchInput.toLowerCase());
            const matchesStore = selectedStoreId ? item.Store?.id === selectedStoreId : true;
            return matchesSearch && matchesStore;
        });

        const totalPageCount = Math.ceil(filteredData.length / currentLimit);
        setTotalPages(totalPageCount);
        const offset = (currentPage - 1) * currentLimit;
        const paginatedProducts = filteredData.slice(offset, offset + currentLimit);
        setListProducts(paginatedProducts);
    }, [searchInput, selectedStoreId, currentPage, allProducts, currentLimit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, selectedStoreId]);

    const fetchAllProducts = async () => {
        let response = await adminDashboardProduct(1, 1000);

        if (response && response.EC === 0) {
            setAllProducts(response.DT.products);
        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const uniqueStores = Array.from(new Set(allProducts.map(item => item.Store?.id)))
        .map(id => {
            const store = allProducts.find(item => item.Store?.id === id).Store;
            return {
                label: store?.name,
                value: store?.id
            };
        });

    const handleRefresh = async () => {
        setSelectedStoreId(null);
        setSearchInput("");
        setCurrentPage(1);
        await fetchAllProducts();
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table header_table_prd">
                <div className='table_manage'>Bảng quản lý sản phẩm</div>
                <button
                    title="refresh"
                    className="btn btn-success refresh"
                    onClick={() => handleRefresh()}
                >
                    <i className="fa fa-refresh"></i> Refresh
                </button>
                <div>
                    <Select
                        className='mb-4 select'
                        value={uniqueStores.find(option => option.value === selectedStoreId) || null}
                        onChange={(selected) => {
                            setSelectedStoreId(selected?.value || null);
                        }}
                        options={uniqueStores}
                    />
                </div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type="text"
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
                        <th>No</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Promotion</th>
                        <th>View_count</th>
                    </tr>
                </thead>
                <tbody>
                    {listProducts && listProducts.length > 0 ? (
                        listProducts.map((item, index) => {
                            const price = item.price;
                            const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                            return (
                                <tr key={index}>
                                    <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                    <td>{item.product_name}</td>
                                    <td>{formattedPrice}</td>
                                    <td>{item.promotion}</td>
                                    <td>{item.view_count}</td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr style={{ textAlign: "center", fontWeight: 600 }}>
                            <td colSpan={5}>Not found ...</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {totalPages > 0 && (
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
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            )}
        </div>
    );
}

export default Product;