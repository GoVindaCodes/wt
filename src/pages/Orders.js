import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";

//internal import
// import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import OrderServices from "services/OrderServices";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import OrderTable from "components/order/OrderTable";
import TableLoading from "components/preloader/TableLoading";
import { notifyError } from "utils/toast";
import spinnerLoadingImage from "assets/img/spinner.gif";
import orderData from "utils/orders";
import useAsync from "hooks/useAsync";
import requests from "services/httpService";

const Orders = () => {
  const {
    limitData,
    // time,
    // setTime,
    // currentPage,
    // searchText,
    // searchRef,
    // status,
    // setStatus,
    // handleChangePage,
    handleSubmitForAll,
    // resultsPerPage,
    // startDate,
    // setStartDate,
    // endDate,
    // setEndDate,
    lang,
    // totalResults,
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState(false);

  const { data, loading } = useAsync(() =>
    OrderServices.getAllOrders({
      customerName: searchText,
      status,
      page: currentPage,
      limit: resultsPerPage,
      day: time,
      startDate,
      endDate,
    })
  );
  // const data = { orders: orderData };
  // const { data, loading } = useAsync(OrderServices.getAllOrders);
  // console.log("datas :", data)
  const {
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    globalSetting,
    handleChangePage,
    searchRef,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    time,
    setTime,
    searchText,
    status,
    setStatus,
    currentPage,
    orderRef,
    handleSubmitOrder,
  } = useFilter(data?.orders);
  // console.log("datas.orders :", data?.orders);
  // console.log("datas.orders :", dataTable);
  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrders({
        customerName: "",
        status: null,
        page: null,
        limit: null,
        day: null,
        startDate: null,
        endDate: null,
      });

      // console.log("handleDownloadOrders", res);
      const exportData = res?.orders?.map((order) => {
        return {
          _id: order._id,
          invoice: order.invoice,
          subTotal: order.subTotal,
          shippingCost: order.shippingCost,
          discount: order?.discount,
          total: order.total,
          paymentMethod: order.paymentMethod,
          status: order.status,
          user_info: order?.user_info?.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      console.log("err on orders download", err);
      notifyError(err ? err?.response?.data?.message : err.message);
    }
  };
  // console.log("data in orders page", data);
  // console.log("data in data.orders page", data?.orders);
  // console.log("data in data table page", dataTable);
  // const [coupons, setCoupons] = useState([]);
  // // console.log("allID : ", allId)
  // useEffect(() => {
  //   const fetchLanguages = async () => {
  //     try {
  //       console.log("Fetching Coupons...");
  //       const response = await requests.get('/api/orders');
  //       console.log("Coupons fetched successfully:", response);
  //       setCoupons(response);
  //     } catch (error) {
  //       console.error('Error fetching languages:', error);
  //     }
  //   };
  //   fetchLanguages();
  // }, []);

  return (
    <>
      {/* {console.log(data)} */}
      <PageTitle>{t("Orders")}</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          {/*  Added By : Govinda 04/23/2023 orderRef instead of search ref */}
          <form onSubmit={handleSubmitOrder}>
            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
              <div>
                <Input
                  // Added By : Govinda 04/23/2023 orderRef instead of search ref
                  ref={orderRef}
                  type="search"
                  name="search"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  placeholder="Search by Customer Name"
                />
              </div>

              <div>
                <Select
                  onChange={(e) => setStatus(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  {/* Hidden has been removed for now on 3/5/2024 */}
                  {/* <option value="Status" defaultValue> */}
                  <option value="Status" defaultValue>
                    {t("Status")}
                  </option>
                  <option value="Delivered">{t("PageOrderDelivered")}</option>
                  <option value="Pending">{t("PageOrderPending")}</option>
                  <option value="Processing">{t("PageOrderProcessing")}</option>
                  <option value="Cancel">{t("OrderCancel")}</option>
                </Select>
              </div>

              <div>
                <Select
                  onChange={(e) => setTime(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  {/* Hidden has been removed for now on 3/5/2024 */}
                  {/* <option value="Order limits" defaultValue hidden> */}
                  <option value="Order limits" defaultValue>
                    {t("Orderlimits")}
                  </option>
                  <option value="5">{t("DaysOrders5")}</option>
                  <option value="7">{t("DaysOrders7")}</option>
                  <option value="15">{t("DaysOrders15")}</option>
                  <option value="30">{t("DaysOrders30")}</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                {loadingExport ? (
                  <Button disabled={true} type="button" className="h-12 w-full">
                    <img
                      src={spinnerLoadingImage}
                      alt="Loading"
                      width={20}
                      height={10}
                    />{" "}
                    <span className="font-serif ml-2 font-light">
                      Processing
                    </span>
                  </Button>
                ) : (
                  <button
                    onClick={handleDownloadOrders}
                    disabled={data?.orders?.length <= 0 || loadingExport}
                    type="button"
                    className={`${(data?.orders?.length <= 0 || loadingExport) &&
                      "opacity-50 cursor-not-allowed bg-red-300"
                      } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium focus:outline-none px-6 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300`}
                  >
                    Download All Orders
                    <span className="ml-2 text-base">
                      <IoCloudDownloadOutline />
                    </span>
                  </button>
                )}
              </div>
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
          serviceData?.length !== 0
            // true
            ? (
              <TableContainer className="mb-8 dark:bg-gray-900">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>{t("InvoiceNo")}</TableCell>
                      <TableCell>{t("TimeTbl")}</TableCell>
                      <TableCell>{t("CustomerName")}</TableCell>
                      <TableCell>{t("MethodTbl")}</TableCell>
                      <TableCell>{t("AmountTbl")}</TableCell>
                      <TableCell>{t("OderStatusTbl")}</TableCell>
                      <TableCell>{t("ActionTbl")}</TableCell>
                      <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
                    </tr>
                  </TableHeader>

                  <OrderTable
                    // data={data}
                    lang={lang}
                    orders={dataTable}
                    globalSetting={globalSetting}
                    currency={globalSetting?.default_currency || "$"}
                  />
                </Table>

                <TableFooter>
                  {/* added by : Govinda 04/22/204 */}
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  />
                  {/* this works  */}
                  {/* <Pagination
                    totalResults={data?.totalDoc}
                    resultsPerPage={handleChangePage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  /> */}
                </TableFooter>
              </TableContainer>
            ) : (
              <NotFound title="Sorry, There are no orders right now." />
            )}
    </>
  );
};

export default Orders;
