import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

// import useAsync from "hooks/useAsync";
import useToggleDrawer from "hooks/useToggleDrawer";
// import UploadManyTwo from "components/common/UploadManyTwo";
import NotFound from "components/table/NotFound";
// import ProductServices from "services/ProductServices";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import ProductTable from "components/product/ProductTable";
import SelectCategory from "components/form/SelectCategory";
// import MainDrawer from "components/drawer/MainDrawer";
// import ProductDrawer from "components/drawer/ProductDrawer";
import CheckBox from "components/form/CheckBox";
// import useProductFilter from "hooks/useProductFilter";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import TableLoading from "components/preloader/TableLoading";
// import SettingServices from "services/SettingServices";
import productData from "utils/products";
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import ProductServices from "services/ProductServices";
import useAsync from "hooks/useAsync";
import requests from "services/httpService";
import useFilter from "hooks/useFilter";
import Loading from "components/preloader/Loading";
import CustomPagination from "./CustomPagination";
// import categoryData from "utils/categories";
const Products = () => {
  const { title, allId, serviceId, handleDeleteMany, handleUpdateMany } =
    useToggleDrawer();
  const { data, loading } = useAsync(ProductServices.getAllProducts);
  // const data = { products: productData }
  const { t } = useTranslation();
  const {
    toggleDrawer,
    lang,
    // currentPage,
    // handleChangePage,
    // searchText,
    category,
    setCategory,
    // searchRef,
    // handleSubmitForAll,
    // sortedField,
    // setSortedField,
    // limitData,
    // totalResults,
  } = useContext(SidebarContext);
  // const { data, loading } = useAsync(() =>
  //   ProductServices.getAllProducts({
  //     page: currentPage,
  //     limit: limitData,
  //     category: category,
  //     title: searchText,
  //     price: sortedField,
  //   })
  // );
  // console.log("hi:", data)
  const {
    // totalResults,
    // resultsPerPage,
    // handleChangePage,
    // dataTable,
    // serviceData,
    globalSetting,
    searchRef,
    sortedField,
    setSortedField,
    currentPage,
    searchText,
    limitData,
    // Added By : Govinda 04/23/2023 sidecontext to usefilters
    handleSubmitForAll,
    totalResults,
    resultsPerPage,
    handleChangePage,
    dataTable,
    serviceData,
    setFilter,
  } = useFilter(data?.products);
  // console.log("serviceData:", serviceData);
  // console.log("currentPage:", currentPage);
  // console.log("resultsPerPage:", resultsPerPage);
  // Add more logs as needed

  // const {  } = useFilter(data?.products);

  // const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  // const currency = globalSetting?.default_currency || "$";
  // console.log("product page", data);

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck((data?.products.map((li) => li._id)));
    // console.log("IDs being set in setIsCheck:", data?.products.map((li) => li._id));

    if (isCheckAll) {
      setIsCheck([]);
    }
    // console.log("ids : ", setIsCheck)
  };
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       console.log("products customers detials...");
  //       const response = await requests.get('/api/products');
  //       console.log("products fetched successfully:", response);
  //       setCategories(response);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);
  // // console.log('productss', categories?.stock)
  // const firstProductQuantity = categories.products[0].quantity;
  // console.log(firstProductQuantity); // This will output 15

  // const {
  //   serviceData,
  //   filename,
  //   isDisabled,
  //   handleSelectFile,
  //   handleUploadMultiple,
  //   handleRemoveSelectFile,
  // } = useProductFilter(data?.products);

  return (
    <>
      <PageTitle>{t("ProductsPage")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title={title} />
      <BulkActionDrawer ids={allId} title="Products" />
      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody className="">
          <form
            onSubmit={handleSubmitForAll}
            className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6  xl:flex"
          >
            <div className="flex justify-start xl:w-1/2  md:w-full">
              {/* <UploadManyTwo
                  title="Products"
                  filename={filename}
                  isDisabled={isDisabled}
                  totalDoc={data?.length}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                /> */}
            </div>
            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany(isCheck)}
                  className="w-full rounded-md h-12 btn-gray text-gray-600 sm:mb-3"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  {t("BulkAction")}
                </Button>
              </div>

              <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck?.length < 1}
                  onClick={() => handleDeleteMany(isCheck, data.products)}
                  className="w-full rounded-md h-12 bg-red-300 disabled btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button
                  onClick={() => {
                    //console.log("Add button clicked"); // Add console.log statement
                    //console.log("Add button clicked with IDs:", data?.products.map(product => product._id));

                    toggleDrawer();
                  }} className="w-full rounded-md h-12"
                >
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("AddProduct")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
        <CardBody>
          <form
            onSubmit={handleSubmitForAll}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={searchRef}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search Product"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <SelectCategory setFilter={setFilter} setCategory={setCategory} lang={lang} />
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Select
                onChange={(e) => setSortedField(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
              >
                {/* <option value="All" defaultValue hidden> */}
                <option value="All" defaultValue>
                  {t("Price")}
                </option>
                <option value="low">{t("LowtoHigh")}</option>
                <option value="high">{t("HightoLow")}</option>
                <option value="published">{t("Published")}</option>
                <option value="unPublished">{t("Unpublished")}</option>
                <option value="status-selling">{t("StatusSelling")}</option>
                <option value="status-out-of-stock">{t("StatusStock")}</option>
                <option value="date-added-asc">{t("DateAddedAsc")}</option>
                <option value="date-added-desc">{t("DateAddedDesc")}</option>
                <option value="date-updated-asc">{t("DateUpdatedAsc")}</option>
                <option value="date-updated-desc">
                  {t("DateUpdatedDesc")}
                </option>
              </Select>
            </div>
          </form>
        </CardBody>
      </Card>

      {
        loading
          // false
          ? (
            <TableLoading row={12} col={7} width={160} height={20} />
          ) :
          // true
          serviceData?.length !== 0
            ?
            (
              <TableContainer className="mb-8 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>
                        <CheckBox
                          type="checkbox"
                          name="selectAll"
                          id="selectAll"
                          isChecked={isCheckAll}
                          handleClick={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>{t("ProductNameTbl")}</TableCell>
                      <TableCell>{t("CategoryTbl")}</TableCell>
                      <TableCell>{t("PriceTbl")}</TableCell>
                      <TableCell>Sale Price</TableCell>
                      <TableCell>{t("StockTbl")}</TableCell>
                      <TableCell>{t("StatusTbl")}</TableCell>
                      <TableCell className="text-center">{t("DetailsTbl")}</TableCell>
                      <TableCell className="text-center">
                        {t("PublishedTbl")}
                      </TableCell>
                      <TableCell className="text-right">{t("ActionsTbl")}</TableCell>
                    </tr>
                  </TableHeader>
                  <ProductTable
                    // data={data}
                    lang={lang}
                    isCheck={isCheck}
                    products={dataTable}
                    setIsCheck={setIsCheck}
                    globalSetting={globalSetting}
                    currency={globalSetting?.default_currency || "$"}
                    resultsPerPage={resultsPerPage}
                  />
                </Table>
                <TableFooter>
                  {/* <Pagination
                    // currentPage={currentPage}
                    // totalResults={totalResults}
                    // resultsPerPage={resultsPerPage}
                    // onChange={handleChangePage}
                    // startCount={Math.min((currentPage - 1) * resultsPerPage + 1, totalResults)}
                    // endCount={Math.min(currentPage * resultsPerPage, totalResults)}
                    // totalResults={totalResults}
                    label="Product Page Navigation"
                  /> */}
                  <CustomPagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                  />
                </TableFooter>

              </TableContainer>
            ) : (
              <NotFound title="Product" />
            )}
    </>
  );
};

export default Products;
