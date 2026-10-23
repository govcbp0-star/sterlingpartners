export const config = {
  web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "",
  firmPhone: import.meta.env.VITE_FIRM_PHONE?.trim() ?? "",
  firmWhatsApp: import.meta.env.VITE_FIRM_WHATSAPP?.trim() ?? "",
  firmEmail: import.meta.env.VITE_FIRM_EMAIL?.trim() ?? "",
};
