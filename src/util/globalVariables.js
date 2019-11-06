import BigNumber from "bignumber.js";
import HomepageLink from "../classes/HomepageLink";

export const ETHGATEWAY = 'MetaMask';

export const BITCAR_TELEGRAM = 'https://t.me/bitcar_io';

export const COLD_WALLET_TEXT = 'Storage';

export const HOT_WALLET_TEXT = 'Trading';

export const BUY_BUTTON_TEXT = 'Buy Fractions';

export const ESCROW_TEXT = "BitCar Escrow";

export const ESCROW_CARD_TEXT = "BitCar in Escrow";

export const DISPLAY_DECIMALS_BITCAR = 3;

export const DISPLAY_DECIMALS_ETH = 6;

export const DISPLAY_DECIMALS_USD = 2;

export const DISPLAY_DECIMALS_USER_BITCAR = 2;

export const DISPLAY_DECIMALS_QUANTITY_SOLD = 0;

export const BITCAR_SHIELD_IMAGE = 'https://raw.githubusercontent.com/BitCar-io/logos/master/crestlogo128x128.png';

export const LEGAL_ENTITY = {
  entityName: "Wonderchange Technologies LDA",
  addressLine1: "Largo 1 de dezembro, Numero 15",
  addressLine2: "2710-496 Sintra",
  country: "Portugal",
  contactEmail: "receipts@bitcar.io",
  registrationNumber: "NIPC 515464570"
}

export const CAR_TITLE_ENTITY = {
  entityName: "Auto Titles Pte Ltd",
  country: "Singapore"
}

export const BITCAR_ENTITY = {
  entityName: "Bitcar Pte Ltd",
  country: "Singapore",
  contactEmail: "info@bitcar.io",
  privacyEmail: "privacy@bitcar.io"
}

export const EXCLUDED_ASSET_CONTRACTS = ['0x99B35463D6c7747C415B9d75ddE6b185C65ae1A3'];

// NB contract address MUST be in lowercase!
export const ASSET_DESCRIPTION_OVERRIDE = {
  '0xc0a53d0390617bec679d4078ce131971c7a6fe0c': [{current: "dash inscribed *'The Last One'* (although this was not the last actual example built).", 
    replacement: "dash inscribed *'The Last One'* (so this is possibly the last one!)."}]
};

export const ASSET_AUCTION_LINK = {
  '0xc0a53d0390617bec679d4078ce131971c7a6fe0c': 'https://go.bitcar.io/sothebys599GTO'
};

export const MEMBERSHIP_RESPONSE = {
  restricted: 403,
  invalid: 400,
  alreadySubmitted: 409
}


export const BIGNUMBER_DEFAULT_FORMAT = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: ''
  };

export const CREDIT_CARD_URL=`https://platform.bitcar.io/${process.env.CREDIT_CARD_HASH}/#/`

BigNumber.config({ FORMAT: BIGNUMBER_DEFAULT_FORMAT });

export const USEFUL_LINKS = [new HomepageLink("Article", "BitCar Quick-Start Guide", "https://medium.com/bitcar-mag/getting-started-with-bitcar-92502022f654"),
new HomepageLink("Article", "Detailed BitCar Platform Guide", "https://medium.com/bitcar-mag/bitcar-platform-guide-42c043946608"),
new HomepageLink("Article", "How to install and use MetaMask", "https://medium.com/bitcar-mag/how-to-install-and-use-metamask-19c5fad9dbae"),
new HomepageLink("Video", "BitCar Explained", "https://www.youtube.com/watch?v=s-AK6BfFysc&list=PLmctvUKLUzZKkk8xB-MrlZTtNEq8V9qqP&index=1"),
new HomepageLink("Video", "Getting Started with the BitCar Platform", "https://www.youtube.com/watch?v=Bx1LaufN2A4&list=PLmctvUKLUzZKkk8xB-MrlZTtNEq8V9qqP&index=2"),
new HomepageLink("Video", "How to install and get started with MetaMask", "https://www.youtube.com/watch?v=YcTqt6FKvgU&list=PLmctvUKLUzZKkk8xB-MrlZTtNEq8V9qqP&index=3"),
new HomepageLink("Website", "BitCar.io", "https://bitcar.io"),
];