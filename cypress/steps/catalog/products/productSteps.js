import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { AVAILABLE_CHANNELS_FORM } from "../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { fillAutocompleteSelect, fillMultiSelect } from "../../shared/selects";
import { addMetadataField } from "../metadataSteps";
import { editSeoSettings } from "../seoSteps";

const valueTrue = AVAILABLE_CHANNELS_FORM.radioButtonsValueTrue;
const valueFalse = AVAILABLE_CHANNELS_FORM.radioButtonsValueFalse;

export function updateProductIsAvailableForPurchase(
  productUrl,
  isAvailableForPurchase
) {
  const isAvailableForPurchaseSelector = isAvailableForPurchase
    ? valueTrue
    : valueFalse;
  const availableForPurchaseSelector = `${AVAILABLE_CHANNELS_FORM.availableForPurchaseRadioButtons}${isAvailableForPurchaseSelector}`;
  updateProductMenageInChannel(productUrl, availableForPurchaseSelector);
}
export function updateProductPublish(productUrl, isPublished) {
  const isPublishedSelector = isPublished ? valueTrue : valueFalse;
  const publishedSelector = `${AVAILABLE_CHANNELS_FORM.publishedRadioButtons}${isPublishedSelector}`;
  updateProductMenageInChannel(productUrl, publishedSelector);
}
export function updateProductVisibleInListings(productUrl) {
  updateProductMenageInChannel(
    productUrl,
    AVAILABLE_CHANNELS_FORM.visibleInListingsButton
  );
}
function updateProductMenageInChannel(productUrl, menageSelector) {
  cy.visit(productUrl)
    .get(AVAILABLE_CHANNELS_FORM.assignedChannels)
    .click()
    .get(menageSelector)
    .click();
  cy.addAliasToGraphRequest("ProductChannelListingUpdate");
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@ProductChannelListingUpdate");
}
export function fillUpCommonFieldsForAllProductTypes(
  { generalInfo, seo, metadata, productOrganization },
  createMode = true
) {
  return fillUpAllCommonFieldsInCreateAndUpdate({ generalInfo, seo, metadata })
    .then(() => {
      if (createMode) {
        fillUpProductOrganization(productOrganization);
      } else {
        fillUpCollectionAndCategory({
          category: productOrganization.category,
          collection: productOrganization.collection
        });
      }
    })
    .then(productOrgResp => productOrgResp);
}
export function fillUpAllCommonFieldsInCreateAndUpdate({
  generalInfo,
  seo,
  metadata
}) {
  return fillUpProductGeneralInfo(generalInfo)
    .then(() => {
      editSeoSettings(seo);
    })
    .then(() => {
      addMetadataField(metadata.public);
    })
    .then(() => {
      addMetadataField(metadata.private);
    });
}
export function fillUpProductGeneralInfo({ name, description, rating }) {
  return cy
    .get(PRODUCT_DETAILS.productNameInput)
    .click()
    .clearAndType(name)
    .get(PRODUCT_DETAILS.descriptionInput)
    .clearAndType(description)
    .get(PRODUCT_DETAILS.ratingInput)
    .clearAndType(rating);
}
export function fillUpProductOrganization({
  productType,
  category,
  collection
}) {
  const organization = {};
  return fillAutocompleteSelect(PRODUCT_DETAILS.productTypeInput, productType)
    .then(selected => {
      organization.productType = selected;
      fillUpCollectionAndCategory({ category, collection });
    })
    .then(collectionAndCategoryResp => {
      organization.category = collectionAndCategoryResp.category;
      organization.collection = collectionAndCategoryResp.collection;
      return organization;
    });
}
export function fillUpCollectionAndCategory({ category, collection }) {
  const organization = {};
  return fillAutocompleteSelect(PRODUCT_DETAILS.categoryInput, category)
    .then(selected => {
      organization.category = selected;
      fillMultiSelect(PRODUCT_DETAILS.collectionInput, collection);
    })
    .then(selected => {
      organization.collection = selected;
      return organization;
    });
}
