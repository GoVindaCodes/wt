import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { showingTranslateValue } from "utils/translate";

const AttributeList = ({ variants, variantTitle, lang, currency }) => {
  console.log("varriants", variants)
  console.log("titles", variantTitle)
  return (
    <>
      <TableBody>
        {variants?.map((variant, i) => (
          <TableRow key={i + 1}>
            <TableCell className="font-semibold uppercase text-xs">
              {i + 1}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {variant?.image ? (
                  <Avatar
                    className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                    src={variant?.image}
                    alt="product"
                  />
                ) : (
                  <Avatar
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    alt="product"
                    className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-sm">
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
                        return showingTranslateValue(attributeName?.en, lang);
                      }
                    })
                    ?.filter(Boolean)
                    .join(" ")}
                </span>
                {variant?.productId && (
                  <span className="text-xs text-gray-500">
                    {/* ({variant.productId}) */}
                    {variantTitle?.map((hi, index) => (
                      <div key={index}>
                        <span>{hi.name.en}: </span>
                        <span>{hi.variants[0]?.name.en}</span>
                      </div>
                    ))}
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {variant?.sku}
            </TableCell>
            <TableCell className="font-semibold uppercase text-xs">
              {variant?.barcode}
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {currency}
              {variant?.originalPrice}
            </TableCell>
            <TableCell className="font-semibold uppercase text-xs">
              {currency}
              {variant?.price}
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {/* {currency} */}
              {variant?.quantity}
              {variant?.stock}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default AttributeList;
