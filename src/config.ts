import { resolveSiteUrl } from "./seoConfig";

export const config = {
  siteUrl: resolveSiteUrl(import.meta.env.VITE_SITE_URL),
  web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "",
  firmPhone: import.meta.env.VITE_FIRM_PHONE?.trim() ?? "",
  firmEmail: import.meta.env.VITE_FIRM_EMAIL?.trim() ?? "",
};
