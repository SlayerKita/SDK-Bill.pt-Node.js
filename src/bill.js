const axios = require('axios');
const { DateTime } = require('luxon');

class ApiClient {
  constructor(mode, version) {
    this.mode = mode;
    this.log = false;
    this.log_file = 'errorlog.html';
    this.memory_log = [];
    this.log_type = 'file';
    this.api_token = '';
    this.version = version;
    this.prefix = `api/${version}/`;
    this.http_code = 0;

    // Assuming you have properties for the following arrays
    this.valid_currency = {
      'EUR_€': 'Euro (€)',
      'USD_$': 'U.S. dollar ($)',
      'GBP_£': 'Pound sterling (£)',
      'CAD_C$': 'Canadian dollar (C$)',
      'AUD_A$': 'Australian dollar (A$)',
      'ZAR_R': 'South African rand (R)',
      'AFN_؋': 'Afghan afghani (؋)',
      'ALL_L': 'Albanian lek (L)',
      'DZD_د.ج': 'Algerian dinar (د.ج)',
      'AOA_Kz': 'Angolan kwanza (Kz)',
      'ARS_$': 'Argentine peso ($)',
      'AMD_դր.': 'Armenian dram (դր.)',
      'AWG_ƒ': 'Aruban florin (ƒ)',
      'AZN_¤': 'Azerbaijani manat (¤)',
      'BSD_$': 'Bahamian dollar ($)',
      'BHD_ب.د': 'Bahraini dinar (ب.د)',
      'BDT_¤': 'Bangladeshi taka (¤)',
      'BBD_$': 'Barbadian dollar ($)',
      'BYR_Br': 'Belarusian ruble (Br)',
      'BZD_$': 'Belize dollar ($)',
      'BMD_$': 'Bermudian dollar ($)',
      'BTN_¤': 'Bhutanese ngultrum (¤)',
      'BOB_Bs.': 'Bolivian boliviano (Bs.)',
      'BAM_KM': 'Bosnia & Herzegovina mark (KM)',
      'BWP_P': 'Botswana pula (P)',
      'BRL_R$': 'Brazilian real (R$)',
      'BND_$': 'Brunei dollar ($)',
      'BGN_лв': 'Bulgarian lev (лв)',
      'BIF_Fr': 'Burundian franc (Fr)',
      'KHR_¤': 'Cambodian riel (¤)',
      'CVE_Esc': 'Cape Verdean escudo (Esc)',
      'KYD_$': 'Cayman Islands dollar ($)',
      'XAF_Fr': 'Central African CFA franc (Fr)',
      'XPF_Fr': 'CFP franc (Fr)',
      'CLP_$': 'Chilean peso ($)',
      'CNY_¥': 'Chinese yuan (¥)',
      'COP_$': 'Colombian peso ($)',
      'KMF_Fr': 'Comorian franc (Fr)',
      'CDF_Fr': 'Congolese franc (Fr)',
      'CRC_₡': 'Costa Rican colón (₡)',
      'HRK_kn': 'Croatian kuna (kn)',
      'CUC_$': 'Cuban convertible peso ($)',
      'CUP_$': 'Cuban peso ($)',
      'CZK_Kč': 'Czech koruna (Kč)',
      'DKK_kr.': 'Danish krone (kr.)',
      'DJF_Fr': 'Djiboutian franc (Fr)',
      'DOP_$': 'Dominican peso ($)',
      'XCD_$': 'East Caribbean dollar ($)',
      'EGP_ج.م': 'Egyptian pound (ج.م)',
      'ERN_Nfk': 'Eritrean nakfa (Nfk)',
      'EEK_KR': 'Estonian kroon (KR)',
      'ETB_¤': 'Ethiopian birr (¤)',
      'FKP_£': 'Falkland Islands pound (£)',
      'FJD_$': 'Fijian dollar ($)',
      'GMD_D': 'Gambian dalasi (D)',
      'GEL_ლ': 'Georgian lari (ლ)',
      'GHS_₵': 'Ghanaian cedi (₵)',
      'GIP_£': 'Gibraltar pound (£)',
      'GTQ_Q': 'Guatemalan quetzal (Q)',
      'GNF_Fr': 'Guinean franc (Fr)',
      'GYD_$': 'Guyanese dollar ($)',
      'HTG_G': 'Haitian gourde (G)',
      'HNL_L': 'Honduran lempira (L)',
      'HKD_$': 'Hong Kong dollar ($)',
      'HUF_Ft': 'Hungarian forint (Ft)',
      'ISK_kr': 'Icelandic króna (kr)',
      'INR_Rs': 'Indian rupee (Rs)',
      'IDR_Rp': 'Indonesian rupiah (Rp)',
      'IRR_﷼': 'Iranian rial (﷼)',
      'IQD_ع.د': 'Iraqi dinar (ع.د)',
      'ILS_₪': 'Israeli new sheqel (₪)',
      'JMD_$': 'Jamaican dollar ($)',
      'JPY_¥': 'Japanese yen (¥)',
      'JOD_د.ا': 'Jordanian dinar (د.ا)',
      'KZT_〒': 'Kazakhstani tenge (〒)',
      'KES_Sh': 'Kenyan shilling (Sh)',
      'KWD_د.ك': 'Kuwaiti dinar (د.ك)',
      'KGS_¤': 'Kyrgyzstani som (¤)',
      'LAK_₭': 'Lao kip (₭)',
      'LVL_Ls': 'Latvian lats (Ls)',
      'LBP_ل.ل': 'Lebanese pound (ل.ل)',
      'LSL_L': 'Lesotho loti (L)',
      'LRD_$': 'Liberian dollar ($)',
      'LYD_ل.د': 'Libyan dinar (ل.د)',
      'LTL_Lt': 'Lithuanian litas (Lt)',
      'MOP_P': 'Macanese pataca (P)',
      'MKD_ден': 'Macedonian denar (ден)',
      'MGA_¤': 'Malagasy ariary (¤)',
      'MWK_MK': 'Malawian kwacha (MK)',
      'MYR_RM': 'Malaysian ringgit (RM)',
      'MVR_Rf': 'Maldivian rufiyaa (Rf)',
      'MRO_UM': 'Mauritanian ouguiya (UM)',
      'MUR_₨': 'Mauritian rupee (₨)',
      'MXN_$': 'Mexican peso ($)',
      'MDL_L': 'Moldovan leu (L)',
      'MNT_₮': 'Mongolian tögrög (₮)',
      'MAD_د.م.': 'Moroccan dirham (د.م.)',
      'MZN_MZN': 'Mozambican metical (MZN)',
      'MMK_K': 'Myanma kyat (K)',
      'NAD_$': 'Namibian dollar ($)',
      'NPR_₨': 'Nepalese rupee (₨)',
      'ANG_ƒ': 'Netherlands Antillean guilder (ƒ)',
      'TWD_$': 'New Taiwan dollar ($)',
      'NZD_$': 'New Zealand dollar ($)',
      'NIO_C$': 'Nicaraguan córdoba (C$)',
      'NGN_₦': 'Nigerian naira (₦)',
      'KPW_₩': 'North Korean won (₩)',
      'NOK_kr': 'Norwegian krone (kr)',
      'OMR_ر.ع.': 'Omani rial (ر.ع.)',
      'PKR_₨': 'Pakistani rupee (₨)',
      'PAB_B/.': 'Panamanian balboa (B/.)',
      'PGK_K': 'Papua New Guinean kina (K)',
      'PYG_₲': 'Paraguayan guaraní (₲)',
      'PEN_S/.': 'Peruvian nuevo sol (S/.)',
      'PHP_₱': 'Philippine peso (₱)',
      'PLN_zł': 'Polish złoty (zł)',
      'QAR_ر.ق': 'Qatari riyal (ر.ق)',
      'RON_L': 'Romanian leu (L)',
      'RUB_р.': 'Russian ruble (р.)',
      'RWF_Fr': 'Rwandan franc (Fr)',
      'SHP_£': 'Saint Helena pound (£)',
      'SVC_₡': 'Salvadoran colón (₡)',
      'WST_T': 'Samoan tala (T)',
      'STD_Db': 'São Tomé and Príncipe dobra (Db)',
      'SAR_ر.س': 'Saudi riyal (ر.س)',
      'RSD_дин.': 'Serbian dinar (дин.)',
      'SCR_₨': 'Seychellois rupee (₨)',
      'SLL_Le': 'Sierra Leonean leone (Le)',
      'SGD_$': 'Singapore dollar ($)',
      'SBD_$': 'Solomon Islands dollar ($)',
      'SOS_Sh': 'Somali shilling (Sh)',
      'KRW_₩': 'South Korean won (₩)',
      'LKR_Rs': 'Sri Lankan rupee (Rs)',
      'SDG_£': 'Sudanese pound (£)',
      'SRD_$': 'Surinamese dollar ($)',
      'SZL_L': 'Swazi lilangeni (L)',
      'SEK_kr': 'Swedish krona (kr)',
      'CHF_Fr': 'Swiss franc (Fr)',
      'SYP_ل.س': 'Syrian pound (ل.س)',
      'TJS_ЅМ': 'Tajikistani somoni (ЅМ)',
      'TZS_Sh': 'Tanzanian shilling (Sh)',
      'THB_฿': 'Thai baht (฿)',
      'TOP_T$': 'Tongan paʻanga (T$)',
      'TTD_$': 'Trinidad and Tobago dollar ($)',
      'TND_د.ت': 'Tunisian dinar (د.ت)',
      'TRY_TL': 'Turkish lira (TL)',
      'TMM_m': 'Turkmenistani manat (m)',
      'UGX_Sh': 'Ugandan shilling (Sh)',
      'UAH_₴': 'Ukrainian hryvnia (₴)',
      'AED_د.إ': 'United Arab Emirates dirham (د.إ)',
      'UYU_$': 'Uruguayan peso ($)',
      'UZS_¤': 'Uzbekistani som (¤)',
      'VUV_Vt': 'Vanuatu vatu (Vt)',
      'VEF_Bs F': 'Venezuelan bolívar (Bs F)',
      'VND_₫': 'Vietnamese đồng (₫)',
      'XOF_Fr': 'West African CFA franc (Fr)',
      'YER_﷼': 'Yemeni rial (﷼)',
      'ZMK_ZK': 'Zambian kwacha (ZK)',
      'ZWR_$': 'Zimbabwean dollar ($)',
      'XDR_SDR': 'Special Drawing Rights (SDR)',
      'TMT_m': 'Turkmen manat (m)',
      'VEB_Bs': 'Venezuelan bolivar (Bs)'
    };
    this.countries = {
      AF: 'Afghanistan',
      AX: 'Aland Islands',
      AL: 'Albania',
      DZ: 'Algeria',
      AS: 'American Samoa',
      AD: 'Andorra',
      AO: 'Angola',
      AI: 'Anguilla',
      AQ: 'Antarctica',
      AG: 'Antigua And Barbuda',
      AR: 'Argentina',
      AM: 'Armenia',
      AW: 'Aruba',
      AU: 'Australia',
      AT: 'Austria',
      AZ: 'Azerbaijan',
      BS: 'Bahamas',
      BH: 'Bahrain',
      BD: 'Bangladesh',
      BB: 'Barbados',
      BY: 'Belarus',
      BE: 'Belgium',
      BZ: 'Belize',
      BJ: 'Benin',
      BM: 'Bermuda',
      BT: 'Bhutan',
      BO: 'Bolivia',
      BA: 'Bosnia And Herzegovina',
      BW: 'Botswana',
      BV: 'Bouvet Island',
      BR: 'Brazil',
      IO: 'British Indian Ocean Territory',
      BN: 'Brunei Darussalam',
      BG: 'Bulgaria',
      BF: 'Burkina Faso',
      BI: 'Burundi',
      KH: 'Cambodia',
      CM: 'Cameroon',
      CA: 'Canada',
      CV: 'Cape Verde',
      KY: 'Cayman Islands',
      CF: 'Central African Republic',
      TD: 'Chad',
      CL: 'Chile',
      CN: 'China',
      CX: 'Christmas Island',
      CC: 'Cocos (Keeling) Islands',
      CO: 'Colombia',
      KM: 'Comoros',
      CG: 'Congo',
      CD: 'Congo, Democratic Republic',
      CK: 'Cook Islands',
      CR: 'Costa Rica',
      CI: "Cote D'Ivoire",
      HR: 'Croatia',
      CU: 'Cuba',
      CY: 'Cyprus',
      CZ: 'Czech Republic',
      DK: 'Denmark',
      DJ: 'Djibouti',
      DM: 'Dominica',
      DO: 'Dominican Republic',
      EC: 'Ecuador',
      EG: 'Egypt',
      SV: 'El Salvador',
      GQ: 'Equatorial Guinea',
      ER: 'Eritrea',
      EE: 'Estonia',
      ET: 'Ethiopia',
      FK: 'Falkland Islands (Malvinas)',
      FO: 'Faroe Islands',
      FJ: 'Fiji',
      FI: 'Finland',
      FR: 'France',
      GF: 'French Guiana',
      PF: 'French Polynesia',
      TF: 'French Southern Territories',
      GA: 'Gabon',
      GM: 'Gambia',
      GE: 'Georgia',
      DE: 'Germany',
      GH: 'Ghana',
      GI: 'Gibraltar',
      GR: 'Greece',
      GL: 'Greenland',
      GD: 'Grenada',
      GP: 'Guadeloupe',
      GU: 'Guam',
      GT: 'Guatemala',
      GG: 'Guernsey',
      GN: 'Guinea',
      GW: 'Guinea-Bissau',
      GY: 'Guyana',
      HT: 'Haiti',
      HM: 'Heard Island & Mcdonald Islands',
      VA: 'Holy See (Vatican City State)',
      HN: 'Honduras',
      HK: 'Hong Kong',
      HU: 'Hungary',
      IS: 'Iceland',
      IN: 'India',
      ID: 'Indonesia',
      IR: 'Iran, Islamic Republic Of',
      IQ: 'Iraq',
      IE: 'Ireland',
      IM: 'Isle Of Man',
      IL: 'Israel',
      IT: 'Italy',
      JM: 'Jamaica',
      JP: 'Japan',
      JE: 'Jersey',
      JO: 'Jordan',
      KZ: 'Kazakhstan',
      KE: 'Kenya',
      KI: 'Kiribati',
      KR: 'Korea',
      KW: 'Kuwait',
      KG: 'Kyrgyzstan',
      LA: "Lao People's Democratic Republic",
      LV: 'Latvia',
      LB: 'Lebanon',
      LS: 'Lesotho',
      LR: 'Liberia',
      LY: 'Libyan Arab Jamahiriya',
      LI: 'Liechtenstein',
      LT: 'Lithuania',
      LU: 'Luxembourg',
      MO: 'Macao',
      MK: 'Macedonia',
      MG: 'Madagascar',
      MW: 'Malawi',
      MY: 'Malaysia',
      MV: 'Maldives',
      ML: 'Mali',
      MT: 'Malta',
      MH: 'Marshall Islands',
      MQ: 'Martinique',
      MR: 'Mauritania',
      MU: 'Mauritius',
      YT: 'Mayotte',
      MX: 'Mexico',
      FM: 'Micronesia, Federated States Of',
      MD: 'Moldova',
      MC: 'Monaco',
      MN: 'Mongolia',
      ME: 'Montenegro',
      MS: 'Montserrat',
      MA: 'Morocco',
      MZ: 'Mozambique',
      MM: 'Myanmar',
      NA: 'Namibia',
      NR: 'Nauru',
      NP: 'Nepal',
      NL: 'Netherlands',
      AN: 'Netherlands Antilles',
      NC: 'New Caledonia',
      NZ: 'New Zealand',
      NI: 'Nicaragua',
      NE: 'Niger',
      NG: 'Nigeria',
      NU: 'Niue',
      NF: 'Norfolk Island',
      MP: 'Northern Mariana Islands',
      NO: 'Norway',
      OM: 'Oman',
      PK: 'Pakistan',
      PW: 'Palau',
      PS: 'Palestinian Territory, Occupied',
      PA: 'Panama',
      PG: 'Papua New Guinea',
      PY: 'Paraguay',
      PE: 'Peru',
      PH: 'Philippines',
      PN: 'Pitcairn',
      PL: 'Poland',
      PT: 'Portugal',
      PR: 'Puerto Rico',
      QA: 'Qatar',
      RE: 'Reunion',
      RO: 'Romania',
      RU: 'Russian Federation',
      RW: 'Rwanda',
      BL: 'Saint Barthelemy',
      SH: 'Saint Helena',
      KN: 'Saint Kitts And Nevis',
      LC: 'Saint Lucia',
      MF: 'Saint Martin',
      PM: 'Saint Pierre And Miquelon',
      VC: 'Saint Vincent And Grenadines',
      WS: 'Samoa',
      SM: 'San Marino',
      ST: 'Sao Tome And Principe',
      SA: 'Saudi Arabia',
      SN: 'Senegal',
      RS: 'Serbia',
      SC: 'Seychelles',
      SL: 'Sierra Leone',
      SG: 'Singapore',
      SK: 'Slovakia',
      SI: 'Slovenia',
      SB: 'Solomon Islands',
      SO: 'Somalia',
      ZA: 'South Africa',
      GS: 'South Georgia And Sandwich Isl.',
      ES: 'Spain',
      LK: 'Sri Lanka',
      SD: 'Sudan',
      SR: 'Suriname',
      SJ: 'Svalbard And Jan Mayen',
      SZ: 'Swaziland',
      SE: 'Sweden',
      CH: 'Switzerland',
      SY: 'Syrian Arab Republic',
      TW: 'Taiwan',
      TJ: 'Tajikistan',
      TZ: 'Tanzania',
      TH: 'Thailand',
      TL: 'Timor-Leste',
      TG: 'Togo',
      TK: 'Tokelau',
      TO: 'Tonga',
      TT: 'Trinidad And Tobago',
      TN: 'Tunisia',
      TR: 'Turkey',
      TM: 'Turkmenistan',
      TC: 'Turks And Caicos Islands',
      TV: 'Tuvalu',
      UG: 'Uganda',
      UA: 'Ukraine',
      AE: 'United Arab Emirates',
      GB: 'United Kingdom',
      US: 'United States',
      UM: 'United States Outlying Islands',
      UY: 'Uruguay',
      UZ: 'Uzbekistan',
      VU: 'Vanuatu',
      VE: 'Venezuela',
      VN: 'Viet Nam',
      VG: 'Virgin Islands, British',
      VI: 'Virgin Islands, U.S.',
      WF: 'Wallis And Futuna',
      EH: 'Western Sahara',
      YE: 'Yemen',
      ZM: 'Zambia',
      ZW: 'Zimbabwe'
    };

    this.memory_log = [];
  }

  isValidCurrency(currency) {
    return this.getCurrencyList().hasOwnProperty(currency);
  }

  getCurrencyList() {
    return this.valid_currency;
  }

  getCountriesList() {
    return this.countries;
  }

  getLogFromMemory() {
    return this.memory_log;
  }

  isValidDateTime = (dateStr, format = 'yyyy-MM-dd HH:mm:ss') => {
    let parsedDate = DateTime.fromFormat(dateStr, format, { zone: 'utc' });
    return parsedDate.isValid && parsedDate.toFormat(format) === dateStr;
  };

  isValidZipCode(zipCode) {
    const regexp = /[0-9]{4}\-[0-9]{3}/;
    return regexp.test(zipCode);
  }

  async validToken() {
    if (this.api_token.length < 120) {
      return false;
    }

    await this.postCheckToken();

    return this.success();
  }

  async postCheckToken() {
    await this.request('POST', 'valid-token', {});
  }

  getModeUrl(url) {
    let domain = 'https://app.bill.pt/';

    if (this.mode === 'dev') {
      domain = 'https://dev.bill.pt/';
    } else if (this.mode === 'world') {
      domain = 'https://int.bill.pt/';
    }

    return `${domain}${this.prefix}${url}`;
  }

  async request(method, url, params = {}) {
    const apiUrl = this.getModeUrl(url);
    const requestData = { api_token: this.api_token, method, ...params };

    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      this.http_code = response.status;

      if (this.log) {
        const time = {
          total: response.data.total_time,
          namelookup: response.data.namelookup_time,
          connect: response.data.connect_time
        };

        this.prettyLog(
          method,
          apiUrl,
          requestData,
          response.data,
          time,
          this.log_type
        );
      }

      return response.data;
    } catch (error) {
      this.http_code = error.response ? error.response.status : 0;

      if (this.log) {
        this.prettyLog(
          method,
          apiUrl,
          requestData,
          error.response ? error.response.data : null,
          {},
          this.log_type
        );
      }

      throw error;
    }
  }

  isJson(string) {
    if (typeof string !== 'string') {
      return false;
    }
    try {
      JSON.parse(string);
      return true;
    } catch (e) {
      return false;
    }
  }

  success() {
    if (this.http_code > 199 && this.http_code < 300) {
      return true;
    }

    return false;
  }

  getHttpCode() {
    return this.http_code;
  }

  setLog(log, type = 'file') {
    this.log = log;
    this.log_type = type;
  }

  setToken(api_token) {
    this.api_token = api_token;
  }

  async getToken(params) {
    return this.request('POST', 'auth/login', params);
  }

  async getDocumentAllTypes() {
    return this.request('GET', 'tipos-documento');
  }

  async getDocumentTypesOf(category) {
    return this.request('GET', 'tipos-documento/' + category);
  }

  async getPaymentMethods() {
    return this.request('GET', 'metodos-pagamento');
  }

  async getDeliveryMethods() {
    return this.request('GET', 'metodos-expedicao');
  }

  async createDeliveryMethod(params) {
    return this.request('POST', 'metodos-expedicao', params);
  }

  async updateDeliveryMethod(id, params) {
    return this.request('PATCH', 'metodos-expedicao/' + id, params);
  }

  async deleteDeliveryMethod(id) {
    return this.request('DELETE', 'metodos-expedicao/' + id);
  }

  async getMeasurementUnits() {
    return this.request('GET', 'unidades-medida');
  }

  async createMeasurementUnit(params) {
    return this.request('POST', 'unidades-medida', params);
  }

  async updateMeasurementUnit(id, params) {
    return this.request('PATCH', 'unidades-medida/' + id, params);
  }

  async deleteMeasurementUnit(id) {
    return this.request('DELETE', 'unidades-medida/' + id);
  }

  async getVehicles() {
    return this.request('GET', 'viaturas');
  }

  async createVehicle(params) {
    return this.request('POST', 'viaturas', params);
  }

  async updateVehicle(id, params) {
    return this.request('PATCH', 'viaturas/' + id, params);
  }

  async deleteVehicle(id) {
    return this.request('DELETE', 'viaturas/' + id);
  }

  async getDocumentSets() {
    return this.request('GET', 'series');
  }

  async createDocumentSet(params) {
    return this.request('POST', 'series', params);
  }

  async updateDocumentSet(id, params) {
    return this.request('PATCH', 'series/' + id, params);
  }

  async deleteDocumentSet(id) {
    return this.request('DELETE', 'series/' + id);
  }

  async getTaxs() {
    return this.request('GET', 'impostos');
  }

  async createTax(params) {
    return this.request('POST', 'impostos', params);
  }

  async updateTax(id, params) {
    return this.request('PATCH', 'impostos/' + id, params);
  }

  async deleteTax(id) {
    return this.request('DELETE', 'impostos/' + id);
  }

  async getTaxExemptions() {
    return this.request('GET', 'motivos-isencao');
  }

  async getWarehouses() {
    return this.request('GET', 'lojas');
  }

  async createWarehouse(params) {
    return this.request('POST', 'lojas', params);
  }

  async updateWarehouse(id, params) {
    return this.request('PATCH', 'lojas/' + id, params);
  }

  async deleteWarehouse(id) {
    return this.request('DELETE', 'lojas/' + id);
  }

  async getContacts(params = {}) {
    return this.request('GET', 'contatos', params);
  }

  async getContactWithID(id, params = {}) {
    return this.request('GET', 'contatos/' + id, params);
  }

  async createContact(params) {
    return this.request('POST', 'contatos', params);
  }

  async updateContact(id, params) {
    return this.request('PATCH', 'contatos/' + id, params);
  }

  async deleteContact(id) {
    return this.request('DELETE', 'contatos/' + id);
  }

  async getItems(params = {}) {
    return this.request('GET', 'items', params);
  }

  async getItemWithID(id, params = {}) {
    return this.request('GET', 'items/' + id, params);
  }

  async createItem(params) {
    return this.request('POST', 'items', params);
  }

  async updateItem(id, params) {
    return this.request('PATCH', 'items/' + id, params);
  }

  async deleteItem(id) {
    return this.request('DELETE', 'items/' + id);
  }

  async getDocuments(params) {
    return this.request('GET', 'documentos', params);
  }

  async getDocumentWithID(id, params = {}) {
    return this.request('GET', 'documentos/' + id, params);
  }

  async createDocument(params) {
    return this.request('POST', 'documentos', params);
  }

  async deleteDocument(id) {
    return this.request('DELETE', 'documentos/' + id);
  }

  async createDocumentOpeningBalance(params) {
    return this.request('POST', 'documentos/saldo-inicial', params);
  }

  async communicateBillOfLanding(id) {
    return this.request('POST', 'documentos/comunicar/guia/' + id);
  }

  async addTransportationCodeManually(params) {
    return this.request('POST', 'documentos/adicionar/codigo-at', params);
  }

  async emailDocument(params) {
    return this.request('POST', 'documentos/enviar-por-email', params);
  }

  async addPrivateNoteToDocument(params) {
    return this.request('POST', 'documentos/nota-documento', params);
  }

  async getStock(params = {}) {
    return this.request('GET', 'stock', params);
  }

  async getStockSingleItem(params = {}) {
    return this.request('GET', 'stock/singular', params);
  }

  async getStockMovements(params = {}) {
    return this.request('GET', 'stock/movimentos', params);
  }

  async documentsWithPendingMovementsFromContact(params = {}) {
    return this.request('GET', 'movimentos-pendentes', params);
  }

  async pendingMovementsOfMultipleDocuments(params = {}) {
    return this.request('GET', 'movimentos-pendentes/multiplos', params);
  }

  async pendingMovementsOfSingleDocument(id) {
    return this.request('GET', 'movimentos-pendentes/' + id);
  }

  async convertDocumentWithID(
    document_id,
    convert_to,
    date = null,
    date_shipping = null,
    date_delivery = null
  ) {
    const original = getDocumentWithID(document_id);
    const document = {
      tipificacao: convert_to,
      contato_id: original.contato_id,
      loja_id: original.loja_id,
      serie_id: original.serie_id,
      metodo_pagamento_id: original.metodo_pagamento_id,
      metodo_expedicao_id: original.metodo_expedicao_id
    };

    if (!isNull(date)) {
      document.data = date;
    }

    if (original.morada && original.morada !== '') {
      document.morada = original.morada;
    }

    if (original.codigo_postal && original.codigo_postal !== '') {
      document.codigo_postal = original.codigo_postal;
    }

    if (original.cidade && original.cidade !== '') {
      document.cidade = original.cidade;
    }

    if (original.pais && original.pais !== '') {
      document.pais = original.pais;
    }

    if (original.carga_morada !== '') {
      document.carga_morada = original.carga_morada;
    }

    if (original.carga_codigo_postal !== '') {
      document.carga_codigo_postal = original.carga_codigo_postal;
    }

    if (original.carga_cidade !== '') {
      document.carga_cidade = original.carga_cidade;
    }

    if (original.carga_pais !== '') {
      document.carga_pais = original.carga_pais;
    }

    if (!isNull(date_shipping) && original.data_carga !== '') {
      document.data_carga = date_shipping;
    }

    if (original.descarga_morada !== '') {
      document.descarga_morada = original.descarga_morada;
    }

    if (original.descarga_codigo_postal !== '') {
      document.descarga_codigo_postal = original.descarga_codigo_postal;
    }

    if (original.descarga_cidade !== '') {
      document.descarga_cidade = original.descarga_cidade;
    }

    if (original.descarga_pais !== '') {
      document.descarga_pais = original.descarga_pais;
    }

    if (!isNull(date_delivery) && original.data_descarga !== '') {
      document.data_descarga = date_delivery;
    }

    const produtos = original.lancamentos.map((lancamento, key) => {
      const lancamento_pai = lancamento.id;
      const produto = Object.assign({}, lancamento);
      produto.lancamento_pai_id = lancamento_pai;
      return produto;
    });

    document.produtos = produtos;
    document.terminado = 1;

    return createDocument(document);
  }

  async createReceipt(params) {
    return request('POST', 'recibos/', params);
  }

  async createReceiptToDocumentWithID(id, params = []) {
    return request('POST', `recibos/pagar/${id}`, params);
  }

  async setTaxAuthorityLoginInformation(params) {
    return request('POST', 'at/configurar', params);
  }

  async testTaxAuthorityLogin() {
    return request('POST', 'at/teste-dados-at');
  }

  async taxAuthorityLoginState() {
    return request('POST', 'at/estado-configuracao');
  }

  async taxAuthortiyCommunicationLog(params = []) {
    return request('POST', 'at/registo-comunicacoes', params);
  }

  async getContactTypes(params = []) {
    return request('GET', 'tipos', params);
  }

  async createContactType(params = []) {
    return request('POST', 'tipos', params);
  }

  async updateContactType(id, params = []) {
    return request('PATCH', `tipos/${id}`, params);
  }

  async getItemCategories(params = []) {
    return request('GET', 'categorias', params);
  }

  async createItemCategory(params = []) {
    return request('POST', 'categorias', params);
  }

  async updateItemCategory(id, params = []) {
    return request('PATCH', `categorias/${id}`, params);
  }

  async getDocumentStates(params = []) {
    return request('GET', 'estados', params);
  }

  async createDocumentState(params = []) {
    return request('POST', 'estados', params);
  }

  async updateDocumentState(id, params = []) {
    return request('PATCH', `estados/${id}`, params);
  }

  async deleteDocumentState(id) {
    return request('DELETE', `estados/${id}`);
  }

  async changeDocumentState(params = []) {
    return request('POST', 'estados/mudar-estado', params);
  }

  async getSmtp() {
    return request('GET', 'smtp');
  }

  async createSmtp(params = []) {
    return request('POST', 'smtp', params);
  }

  async deleteSmtp() {
    return request('DELETE', 'smtp');
  }

  async sendSmtpEmailTest(params = []) {
    return request('POST', 'smtp/email-teste', params);
  }

  async getEmailTemplates(params = []) {
    return request('GET', 'email-template', params);
  }

  async createEmailTemplate(params = []) {
    return request('POST', 'email-template', params);
  }

  async updateEmailTemplate(id, params = []) {
    return request('PATCH', `email-template/${id}`, params);
  }

  async deleteEmailTemplate(id) {
    return request('DELETE', `email-template/${id}`);
  }

  prettyLog(method, url, params, result, response_time, type_of_log = 'file') {
    if (this.log_type === 'memory') {
      this.memory_log.push({
        method,
        url,
        params,
        result,
        response_time
      });
      return;
    }

    if (!fs.existsSync(this.log_file)) {
      response_time = response_time.total;

      const logContent = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.5.1/css/bulma.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
        <script>
          jQuery(document).ready(function(){
            function output(inp) {
              return inp;
            }

            function syntaxHighlight(json) {
              json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
              return json.replace(/("(\\u[a-zA-Z0-9]{4}|\[^u]|[^\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = "number1";
                if (/^"/.test(match)) {
                  if (/:$/.test(match)) {
                    cls = "key";
                  } else {
                    cls = "string";
                  }
                } else if (/true|false/.test(match)) {
                  cls = "boolean";
                } else if (/null/.test(match)) {
                  cls = "null";
                }
                return "<span class=\"" + cls + "\">" + match + "</span>";
              });
            }

            $("pre.json").each(function(){
              var div = $(this);
              var obj = JSON.parse(div.html());
              var str = JSON.stringify(obj, undefined, 4);
              div.html(output(syntaxHighlight(str)));
            });
          });
        </script>
        <style>
          pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; color: #fff; background: #212121}
          .string { color: #FD971F; }
          .number1 { color: #66D9EF; }
          .boolean { color: #A6E22E; }
          .null { color: #F92672; }
          .key { color: #A6E22E; }
        </style>
    `;

      fs.writeFileSync(this.log_file, logContent);
    }

    const type = ['json', 'json'];

    if (this.isJson(params)) {
      params_dump = params;
    } else {
      if (Array.isArray(params)) {
        params_dump = JSON.stringify(params);
      } else {
        type[0] = 'dump';
        params_dump = util.inspect(params);
      }
    }

    if (this.isJson(result)) {
      result_dump = result;
    } else {
      if (Array.isArray(result)) {
        result_dump = JSON.stringify(result);
      } else {
        type[1] = 'dump';
        result_dump = util.inspect(result);
      }
    }

    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const data = `
    <div class="container">
      <div class="box">
        <div class="control">
          <div class="tags has-addons">
            <span class="tag is-warning">${method}</span>
            <span class="tag is-dark">${url} - ${date}</span>
          </div>
        </div>
        <hr>
        <div class="control">
          <div class="tags has-addons">
            <span class="tag is-info">Parameters</span>
            <span class="tag is-black">${date}</span>
          </div>
          <div class="tags has-addons">
            <span class="tag is-info">Time</span>
            <span class="tag is-black">${response_time}</span>
          </div>
        </div>
        <pre class="${type[0]}">${params_dump}</pre>
        <hr>
        <div class="control">
          <div class="tags has-addons">
            <span class="tag is-success">Response</span>
            <span class="tag is-black">${date}</span>
          </div>
        </div>
        <pre class="${type[1]}">${result_dump}</pre>
      </div>
    </div>
    <hr>
  `;

    fs.appendFileSync(this.log_file, data);
  }
}

// Example usage:
const apiClient = new ApiClient('dev', '1.0');
console.log(apiClient.mode);
console.log(apiClient.version);
apiClient.setToken(
  'KHo3hrxmtxyTkmX4XVIgaX4SwLRaWRJ8QZUBnOC4Wqth5Rgs5sXnGmxWENIybee7CVL9OZ4yYAbjBeMzaAWHRuCsDVPrPZKUhhvVNUGtzFkrRLpBiY5hfmz0lpFGfZYB'
);

console.log(apiClient.isValidCurrency('VEB_Bs'));
console.log(apiClient.isValidZipCode('1A00-018'));
console.log(apiClient.isValidDateTime('2018-12-25 23:50:55'));

apiClient.validToken().then(function (response) {
  console.log(response);
});

apiClient
  .getToken({ 'email': 'kita.rico@gmail.com', 'password': '123456' })
  .then(function (response) {
    console.log(response);
  });

apiClient.getDocumentAllTypes().then(function (response) {
  console.log(response);
});

apiClient.getMeasurementUnits().then(function (response) {
  console.log(response);
});

apiClient
  .createMeasurementUnit({ 'nome': 'Kelvin', 'simbolo': 'K' })
  .then(function (response) {
    console.log(response);
  });
