import { useTranslation } from "react-i18next";
import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";

//internal import
import CombinationInput from "components/form/CombinationInput";
import SkuBarcodeInput from "components/form/SkuBarcodeInput";
import EditDeleteButtonTwo from "components/table/EditDeleteButtonTwo";
import { showingTranslateValue } from "utils/translate";

const AttributeListTable = ({
  lang,
  variants,
  setTapValue,
  variantTitle,
  deleteModalShow,
  isBulkUpdate,
  handleSkuBarcode,
  handleEditVariant,
  handleRemoveVariant,
  handleQuantityPrice,
  handleSelectInlineImage,
}) => {
  const { t } = useTranslation();
  console.log("hi", variantTitle)
  console.log("variants", variants)
  return (
    <>
      <TableBody>
        {variants?.map((variant, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <div className="flex items-center ">
                {variant.image ? (
                  <span>
                    <Avatar
                      className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                      src={variant.image}
                      alt="product"
                    />
                    <p
                      className="text-xs cursor-pointer"
                      onClick={() => handleSelectInlineImage(i)}
                    >
                      {t("Change")}
                    </p>
                  </span>
                ) : (
                  <span>
                    <Avatar
                      src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                      alt="product"
                      className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                    />
                    <p
                      className="text-xs cursor-pointer"
                      onClick={() => handleSelectInlineImage(i)}
                    >
                      {t("Change")}
                    </p>
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell>
              <div className="flex flex-col text-sm">
                {variantTitle?.length > 0 && (
                  <span>
                    {variantTitle
                      ?.map((att) => {
                        const attributeData = att?.variants?.filter(
                          (val) => val?.name.en !== "All"
                        );

                        const attributeName = attributeData?.find(
                          (v) => v._id === variant[att?._id]
                        )?.name.en;
                        if (attributeName === undefined) {
                          return attributeName?.en;
                        } else {
                          return showingTranslateValue(attributeName.en, lang);
                        }
                      })
                      ?.filter(Boolean)
                      .join(" ")}
                  </span>
                )}

                {variant.productId && (
                  <span className="text-xs productId text-gray-500">
                    {/* ({variant.productId}) */}
                    {variantTitle?.map((hi, index) => (
                      <div key={index}>
                        <span>{hi?.name?.en}: </span>
                        <span>{hi?.variants[0]?.name?.en}</span>
                      </div>
                    ))}

                  </span>
                )}
              </div>
            </TableCell>

            <TableCell>
              <SkuBarcodeInput
                id={i}
                name="sku"
                placeholder="Sku"
                value={variant.sku}
                handleSkuBarcode={handleSkuBarcode}
              />
            </TableCell>

            <TableCell>
              <SkuBarcodeInput
                id={i}
                name="barcode"
                placeholder="Barcode"
                value={variant.barcode}
                handleSkuBarcode={handleSkuBarcode}
              />
            </TableCell>

            <TableCell className="font-medium text-sm">
              <CombinationInput
                id={i}
                readOnly
                name="originalPrice"
                placeholder="Original Price"
                variant={variant}
                isBulkUpdate={isBulkUpdate}
                value={variant.originalPrice || "0"}
                handleQuantityPrice={handleQuantityPrice}
              />
            </TableCell>

            <TableCell className="font-medium text-sm">
              <CombinationInput
                id={i}
                name="price"
                placeholder="Sale price"
                variant={variant}
                isBulkUpdate={isBulkUpdate}
                value={variant.price || "0"}
                handleQuantityPrice={handleQuantityPrice}
              />
            </TableCell>

            <TableCell className="font-medium text-sm">
              <CombinationInput
                id={i}
                name="quantity"
                placeholder="Quantity"
                variant={variant}
                isBulkUpdate={isBulkUpdate}
                handleQuantityPrice={handleQuantityPrice}
                value={variant.quantity || "0"}
              />
            </TableCell>

            <TableCell>
              <EditDeleteButtonTwo
                attribute
                variant={variant}
                setTapValue={setTapValue}
                deleteModalShow={deleteModalShow}
                handleEditVariant={handleEditVariant}
                handleRemoveVariant={handleRemoveVariant}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default AttributeListTable;
